---
    weight: 1695118864000
    date: 2023-09-19T10:21:04.000Z
    draft: false
    author: nscc-neuro
    title: th2k 超算使用教程
    icon: menu_book
    toc: true
    description: ""
    publishdate: 2023-09-19T10:21:04.000Z
    tags: ["Beginners"]
    categories: [""]
---

## 快速入门
在获取上机账号后， Linux\Mac 用户可通过命令行登录集群， Windows 用户则可以通过 ssh 客户端登录集群；登录集群后，编写作业脚本，并通过 sbatch 指令将作业提交到计算节点上执行；此外，集群上安装了常见的计算软件，通过module 指令导入计算环境。
**先登录集群，**登录前确保网络环境为内网 VPN
Linux\Mac 用户直接使用系统自带的终端通过ssh命令登录：
```shell
ssh user_name@ip_address -i /path/to/private_key
```
Window 用户可使用Xshell客户端进行登陆。[下载Xshell](https://www.netsarang.com/zh/free-for-home-school/)，选择免费许可版，为了方便文件传输，可同时下载并安装 Xftp，安装完后点击软件左上角新建连接，输入IP和用户名，选择私钥文件即可登录；
**登录后，编写作业脚本，并通过sbatch命令将作业提交到计算节点上执行。**
假设我们的计算过程为：在计算节点上运行 hostname 指令，那么就可以这么编写作业脚本；
```python
#!/bin/bash
#SBATCH -o job.%j.out
#SBATCH --partition=gpu_v100
#SBATCH -J myFirstJob
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1

hostname
```
假设上面作业脚本的文件名为job.sh，通过以下命令提交：
```shell
sbatch job.sh
```
**集群安装了常见的计算软件，可以通过module指令导入计算环境；**
可以通过module加载平台上装有的软件环境，也可以自行安装配置需要的计算环境，下面的作业脚本加载了intel_parallel_studio/2017.1的软件环境，具体可用的软件环境可使用命令 module avail 指令进行查看。
```shell
#!/bin/bash
#SBATCH -o job.%j.out
#SBATCH --partition=C032M0128G
#SBATCH -J myFirstJob
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=2

module purge
module load intel_parallel_studio/2017.1
mpirun -n 2  hostname
```
## 连接集群
### VPN 连接方式
从 [Hillstone Secure Connect](https://www.hillstonenet.com.cn/support-and-training/hillstone-secure-connect/) 下载最新版的支持 SSL VPN 功能的客户端，并使用 VPN 用户名与密码即可登录 VPN。

1. 互联网客户端填写顺序如下：

服务器：vpn3.nscc-gz.cn或vpn1.nscc-gz.cn
端口号：4433
账号：VPN账号
密码：VPN密码

2. 超算中心办公网和专线用户客户端填写顺序如下：

服务器：172.16.100.254
端口号：4433
账号：VPN账号
密码：VPN密码

3. 中山大学校园网用户访问方法：

服务器：222.200.179.12或222.200.179.9
端口号：4433
账号：VPN账号
密码：VPN密码
## Linux\Mac 登录和传输数据
Linux\Mac用户通过自带的命令行终端，以ssh的方式登录；
打开终端后通过以下命令连接，连接前请确保连接了 VPN
```shell
# user_name为上机账号，ip_address为所要连接集群的IP
ssh user_name@ip_address -i /path/to/private_key
```
通过 scp 或者 rsync 传输数据（需要带上 -i 选项）
```shell
scp [-r] file username@ip_address:~/
# 该命令将会把本地的名为file的文件上传到集群的home目录下,如果file是一个目录的话还需要加上参数r
scp [-r] username@ip_address:~/file ./
# 该命令将会把服务器上home目录下名为file的文件下载到本地当前文件夹下
rsync [-Pr] file username@ip_address:~/
# 该命令将会把本地的名为file的文件同步到集群的home目录下,如果file是一个目录的话还需要加上参数r
rsync [-Pr] username@ip_address:~/file ./
# 该命令将会把服务器上home目录下名为file的文件同步到本地当前文件夹下
```
## 提交作业
## 使用软件

