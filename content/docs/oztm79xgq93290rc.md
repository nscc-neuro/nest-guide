---
    weight: 1695109665000
    date: 2023-09-19T07:47:45.000Z
    draft: false
    author: nscc-neuro
    title: NEST 集群版部署记录
    icon: menu_book
    toc: true
    description: ""
    publishdate: 2023-09-19T07:47:45.000Z
    tags: ["Beginners"]
    categories: [""]
---

## 1. 设置内网 VPN

从 [Hillstone Secure Connect](https://www.hillstonenet.com.cn/support-and-training/hillstone-secure-connect/) 下载最新版的支持 SSL VPN 功能的客户端。

![](https://cuterwrite-1302252842.file.myqcloud.com//brain-sim/images/55459dc850de5d7fa7b882904e3ee870.png)

输入 VPN 账号、密码和对应的 VPN 地址，登录后即可访问内网集群资源。

（图片暂时略）

## 2. 登录集群

此部分缺少具体步骤，请补充。
Mac用户首先将秘钥文件放到.ssh文件夹内，并在.ssh文件夹内的config文件中添加如下信息：
```json
Host SelfDefineName
  HostName 172.16.20.102
  IdentityFile Path/to/Private_key
  User Username
```
在登录内网VPN的前提下，可在终端输入命令ssh SelfDefineName测试集群连接是否成功，或直接使用vscode连接集群。注意：连接集群必须使用VPN。
## 3. 设置外网代理

在环境变量中配置：

```shell
export http_proxy=http://10.20.18.21:3128
export HTTP_PROXY=http://10.20.18.21:3128
export https_proxy=http://10.20.18.21:3128
export HTTPS_PROXY=http://10.20.18.21:3128
export no_proxy="localhost,127.0.0.1"
```

在命令行配置：

```bash
git config --global http.proxy http://10.20.18.21:3128
git config --global https.proxy http://10.20.18.21:3128
```

## 4. 安装 Miniconda3

从 [Miniconda3 官方网站](https://repo.anaconda.com/miniconda/Miniconda3-py39_23.5.2-0-Linux-x86_64.sh) 下载 Miniconda3。

执行 Miniconda3-py39_23.5.2-0-Linux-x86_64.sh，按照提示安装 Miniconda3。

## 5. 安装 Boost

从 [Boost 官方网站](https://boostorg.jfrog.io/artifactory/main/release/1.77.0/source/boost_1_77_0.tar.gz) 下载 Boost。

解压 boost_1_77_0.tar.gz 文件。

在 Boost 根目录下执行以下命令安装 Boost（需要将路径换成自己的安装路径）：

```bash
./bootstrap.sh --prefix=/GPUFS/sysu_hpcscc_1/lvtx/tools/boost/1.81.0-gcc-12.2.0 CC=gcc CXX=g++ FC=gfortran CFLAGS='-O3' CXXFLAGS='-O3' FCFLAGS='-O3'
```

## 6. 安装 GNU Scientific Library

从 [GNU Scientific Library 镜像站](https://mirror.ibcp.fr/pub/gnu/gsl/gsl-latest.tar.gz) 下载 GSL。

解压 gsl-latest.tar.gz。

在 GSL 根目录执行以下命令安装 GSL（需要将路径换成自己的安装路径）：

```bash
./configure --prefix=/GPUFS/sysu_hpcscc_1/lvtx/tools/gsl/2.7.1-gcc-8.4.0 CC=gcc CXX=g++ FC=gfortran CFLAGS='-O3' CXXFLAGS='-O3' FCFLAGS='-O3'
```

## 7. 安装 NEST

从 [NEST github仓库](https://github.com/nest/nest-simulator/archive/refs/tags/v3.4.tar.gz) 下载 NEST 3.4。

解压 v3.4.tar.gz。

使用 pip 安装 numpy, scipy, cython:

```bash
pip3 install numpy scipy cython
```

在 nest-simulator-3.4 目录下执行（需要将路径换成自己的路径）：

```bash
cmake -DCMAKE_C_COMPILER=mpicc \
      -DCMAKE_CXX_COMPILER=mpicxx \
      -Dwith-mpi=/GPUFS/sysu_hpcscc_1/lvtx/tools/mvapich2/2.3.7-gcc-12.2.0/bin/mpiexec \
      -DCMAKE_C_FLAGS='-O3 -fPIC' \
      -DCMAKE_CXX_FLAGS='-O3' \
      -Dwith-boost=/GPUFS/sysu_hpcscc_1/lvtx/tools/boost/1.81.0-gcc-12.2.0/ \
      -DGSL_INCLUDE_DIR=/GPUFS/sysu_hpcscc_1/lvtx/tools/gsl/2.7.1-gcc-12.2.0/include \
      -DGSL_LIBRARY=/GPUFS/sysu_hpcscc_1/lvtx/tools/gsl/2.7.1-gcc-12.2.0/lib/libgsl.a \
      -DGSL_CBLAS_LIBRARY=/GPUFS/sysu_hpcscc_1/lvtx/tools/gsl/2.7.1-gcc-12.2.0/lib/libgslcblas.a \
      -DCMAKE_INSTALL_PREFIX:PATH=/GPUFS/sysu_hpcscc_1/lvtx/tools/nest-simulator/3.0-gcc-12.2.0 .
```

运行nest前需要配置nest环境，即source /GPUFS/nsccgz_zgchen_2/zyl/tools/nest-simulator/3.4-gcc-8.4.0/bin/nest_vars.sh （需要将路径换成自己的路径）。或者直接在env.sh中增加如下语句：
```bash
# NEST 3.4 config
NEST_BASE_PATH=/GPUFS/nsccgz_zgchen_2/zyl/tools/nest-simulator/3.4-gcc-8.4.0
source $NEST_BASE_PATH/bin/nest_vars.sh
```
## 
## 8. 运行 hpc_benchmark.py
在您安装的 NEST 目标路径中，hpc_benchmark.py 位于<NEST安装目标路径>/share/doc/nest/examples/pynest/hpc_benchmark.py ，您需要修改其中的 params 以并行运行更大的模型。

1. 修改 nvp 为所需 MPI进程数 × 每进程线程数，如 2 MPI进程 × 14线程 = 28
2. 设置合适的scale，如10。更大的需要更多nvp。

```python
params = {
    'nvp': 28,               # total number of virtual processes
    'scale': 10.,            # scaling factor of the network size
    # others...
}
```

设置环境变量以指示每个 MPI 进程启用线程数量，然后使用 mpiexec 运行
```shell
export OMP_NUM_THREADS=14
mpiexec -N 1 -n 2 -p gpu_v100 --export=all python3 hpc_benchmark.py
```
其中 -N 指定节点个数， -n 指定所有节点总共的MPI进程数，-p 指定 slurm 从该分区分配节点（sinfo查看各节点），--export 导出所有环境变量。
这将耗费大抵一分钟，随后您将在终端看到 NEST 来自两个MPI 进程的双份输出；同时，会在运行启动指令的目录下得到输出文件。 #TODO： 定向输出文件

