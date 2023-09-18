---
weight: 2
date: "2023-09-17"
draft: false
author: "nscc-neuro"
title: "NEST 集群部署文档"
icon: "rocket_launch"
toc: true
description: ""
publishdate: "2023-09-18"
tags: ["Beginners"]
categories: [""]
---

## 1. 设置内网 VPN
从 [Hillstone Secure Connect](https://www.hillstonenet.com.cn/support-and-training/hillstone-secure-connect/) 下载最新版的支持 SSL VPN 功能的客户端。

![20230918231257-2023-09-18](https://cuterwrite-1302252842.file.myqcloud.com/img/20230918231257-2023-09-18.png)

输入 VPN 账号、密码和对应的 VPN 地址，登录后即可访问内网集群资源。

图片暂时略

## 2. 登录集群
此部分缺少具体步骤，请补充。

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
```
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

```
./bootstrap.sh --prefix=/GPUFS/sysu_hpcscc_1/lvtx/tools/boost/1.81.0-gcc-12.2.0 CC=gcc CXX=g++ FC=gfortran CFLAGS='-O3' CXXFLAGS='-O3' FCFLAGS='-O3'
```

## 6. 安装 GNU Scientific Library
从 [GNU Scientific Library 镜像站](https://mirror.ibcp.fr/pub/gnu/gsl/gsl-latest.tar.gz) 下载 GSL。

解压 gsl-latest.tar.gz。

在 GSL 根目录执行以下命令安装 GSL（需要将路径换成自己的安装路径）：

```
./configure --prefix=/GPUFS/sysu_hpcscc_1/lvtx/tools/gsl/2.7.1-gcc-8.4.0 CC=gcc CXX=g++ FC=gfortran CFLAGS='-O3' CXXFLAGS='-O3' FCFLAGS='-O3'
```

## 7. 安装 NEST
从 [NEST github仓库](https://github.com/nest/nest-simulator/archive/refs/tags/v3.4.tar.gz) 下载 NEST 3.4。

解压 v3.4.tar.gz。

使用 pip 安装 numpy, scipy, cython:

```
pip3 install numpy scipy cython
```

在 nest-simulator-3.4 目录下执行（需要将路径换成自己的路径）：

```
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

## 8. 运行 hpc_benchmark