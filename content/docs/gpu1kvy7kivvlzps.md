---
    weight: 1697187566000
    date: 2023-10-13T08:59:26.000Z
    draft: false
    author: nscc-neuro
    title: Neuron 8.2.3 部署记录
    icon: menu_book
    toc: true
    description: ""
    publishdate: 2023-10-13T08:59:26.000Z
    tags: ["Beginners"]
    categories: [""]
---

## 安装所需依赖项
为了从源代码构建 Neuron-8.2.3，需要提供以下程序包：

- Bison
- Flex >= 2.6
- C/C++ compiler suite supporting C++17 (e.g. GCC >=9.3.1, Clang >= 11.0.0)
   - 注意，C++17的某些功能需要较新的编译器版本。
   - C++17功能必须在不链接额外库的情况下可用。这特别排除了一些旧版本的GCC，其中std::FileSystem需要libstdc++fs.so。
- CMake >= 3.15 (>= 3.18 if -DNRN_ENABLE_PYTHON_DYNAMIC=ON)
- Python >=3.8 (for Python interface)
- Cython < 3 (for RXD)
- MPI (for parallel)
- X11 (for GUI)

我选择的环境是：

- gcc 11.2.0
- CMake 3.27.7-gcc-11.2.0
- Cython 0.29.36
- MPI openmpi 4.1.6-gcc-11.2.0
- Python 3.10.12
## 加载代理网络环境
加载代理网络环境的脚本如下，如果你没有的话建议创建一个
```bash
export http_proxy=http://10.20.18.21:3128
export HTTP_PROXY=http://10.20.18.21:3128
export https_proxy=http://10.20.18.21:3128
export HTTPS_PROXY=http://10.20.18.21:3128
git config --global http.proxy http://10.20.18.21:3128
git config --global https.proxy http://10.20.18.21:3128

export no_proxy="localhost,127.0.0.1"
```
首先，在登录节点执行以下命令以设置网络代理
```bash
source proxy.sh
```

## 安装 GCC-11.2.0

1. 下载 GCC-11.2.0 源代码
```bash
wget http://mirror.linux-ia64.org/gnu/gcc/releases/gcc-11.2.0/gcc-11.2.0.tar.gz
```

2. 解压源代码压缩文件包
```bash
srun -N 1 -p gpu_v100_test tar -xzvf gcc-11.2.0.tar.gz
```

3. 下载 GCC 依赖项
```bash
cd gcc-11.2.0
./contrib/download_prerequisites
```

4. 编译安装 GCC
```bash
srun -N 1 -p gpu_v100_test ./configure --prefix=/path/to/install \
--enable-bootstrap \
--enable-languages=c,c++ \
--enable-threads=posix \
--enable-checking=release \
--disable-multilib \
--with-system-zlib \
&& make -j$(nproc) \
&& make install
```

5. 新建一个 `modulefile` 文件，路径自己定，推荐在自己的目录下新建一个modulefiles目录，然后新建一个gcc/11.2.0 文件，文件内容如下：（root更换成GCC-11.2.0的安装路径）
```bash
#%Module######################################################################
##                                                                          ##
##                        TianHe-2 software modulefile                      ##
##                                                                          ##
##############################################################################

proc ModulesHelp { } {
        puts stderr "This is a gcc compiler"
        puts stderr "use the `-Wl,-rpath -Wl,LIBDIR' linker flag"
}

conflict gcc

set root /GPUFS/nsccgz_zgchen_2/pangshzh/software/gcc-11.2.0/usr/local

prepend-path INCLUDE  $root/include
prepend-path CPATH    $root/include
prepend-path LD_LIBRARY_PATH $root/libexec
prepend-path LD_LIBRARY_PATH $root/lib
prepend-path LD_LIBRARY_PATH $root/lib64
prepend-path LIBRARY_PATH $root/libexec
prepend-path LIBRARY_PATH $root/lib
prepend-path LIBRARY_PATH $root/lib64
prepend-path PATH $root/bin

setenv CC $root/bin/gcc
setenv CXX $root/bin/g++

# Installed by whoami, xxxx/xx/xx
##############################################################################
```

6. 之后就可以使用 module load /path/to/modulefile来加载GCC-11.2.0了，也可以加入以下环境变量，将整个modulefiles目录加入到MODULEPATH中，就可以通过 `module avail`找到自己所有的module包：
```bash
export MODULEPATH=/path/to/modulefiles:$MODULEPATH 
```

## 安装 CMake-3.27.7

1. 下载 CMake 源代码：
```bash
wget https://ghproxy.com/github.com/Kitware/CMake/archive/refs/tags/v3.27.7.tar.gz
```

2. 解压源代码压缩文件包
```bash
srun -N 1 -p gpu_v100_test tar -xzvf v3.27.7.tar.gz
```

3. 编译安装 CMake
```bash
# 加载 gcc 11.2.0，需要在MODULEPATH中添加路径
module load gcc/11.2.0

cd CMake-3.27.7
srun -N 1 -p gpu_v100_test ./bootstrap --prefix=/path/to/install \
&& gmake \
&& make install
```

## 安装 Mvapich2-2.3.7

1. 下载 Mvapich2 源代码：
```bash
wget https://mvapich.cse.ohio-state.edu/download/mvapich/mv2/mvapich2-2.3.7-1.tar.gz
```

2. 解压源代码压缩文件包
```bash
srun -N 1 -p gpu_v100_test tar -xzvf mvapich2-2.3.7-1.tar.gz
```

3. 使用 GCC-11.2.0 编译安装 Mvapich2
```bash
cd mvapich2-2.3.7
srun -N 1 -p gpu_v100_test ./configure --prefix=/path/to/install \
&& make -j4 \
&& make install
```
## 下载并解压Neuron源代码

1. 下载Neuron-8.2.3源代码
```bash
wget https://ghproxy.com/github.com/neuronsimulator/nrn/archive/refs/tags/8.2.3.tar.gz
```

2. 解压源代码压缩文件包
```bash
srun -N 1 -p gpu_v100_test tar -xzvf 8.2.3.tar.gz
```
## 创建一个专用于Neuron的conda虚拟环境

1. 首先配置好 `CONDA_PATH`
```bash
export CONDA_PATH=/GPUFS/nsccgz_zgchen_2/pangshzh/software/miniconda3
export PATH=$CONDA_PATH/bin:$PATH

// 切换到你的conda环境
source activate
```

2. 创建虚拟环境，使用 python 3.10
```bash
conda create -n nrn python=3.10
conda activate nrn
```

3. 安装 Cython < 3 (for RXD)
```bash
pip3 install cython==0.29.36
```
## 申请一个计算节点方便进行后续编译

1. 申请计算节点
```bash
salloc -N 1 -p gpu_v100
```

2. 通过 `yhq`查看你的节点位置，然后通过 `ssh`命令登录到申请的节点上，例如
```bash
ssh gpu39
```

3. 加载所需环境
```bash
export CONDA_PATH=/GPUFS/nsccgz_zgchen_2/pangshzh/software/miniconda3
export PATH=$CONDA_PATH/bin:$PATH

// 切换到你的conda环境
source activate
conda activate nrn

// 检查python路径是否正确，应该显示~/pangshzh/software/miniconda3/envs/nrn/bin/python
which python

// 加载 ncurses 库
module load ncurses
// 加载 cmake
module load cmake
// 加载 gcc
module load gcc/8.4.0
```
