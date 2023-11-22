---
    weight: 1697015519000
    date: 2023-10-11T09:11:59.000Z
    draft: false
    author: nscc-neuro
    title: 远程连接集群（Slurm）上的 jupyter lab
    icon: menu_book
    toc: true
    description: ""
    publishdate: 2023-10-11T09:11:59.000Z
    tags: ["Beginners"]
    categories: [""]
---

## 安装 jupyter lab
首先，下载并安装Miniconda。可以从Miniconda的官方网站（[https://docs.conda.io/en/latest/miniconda.html](https://docs.conda.io/en/latest/miniconda.html)）下载。

安装完成后，打开终端，创建一个新的 conda 环境，可以使用以下命令：
```bash
conda create -n jupyter python=3.10
```
然后，激活新创建的环境
```bash
source activate jupyter
```
在激活的环境中，使用如下的命令安装 jupyter lab
```bash
conda install -c conda-forge jupyterlab
```
## 启动 jupyter lab
安装完成后，在计算节点（比如 gpu_v100分区下的gpu22节点) 上启动jupyter
```bash
jupyter-lab --no-browser --port=8014 --ip=127.0.0.1
```
启动后如下：
![](https://cuterwrite-1302252842.file.myqcloud.com/brain-sim/images/7ead686bfee72aebfd423db6b5e8737a.png)
以上启动完毕。

## 建立隧道
在本地电脑cmd输入如下代码，建立隧道。
```bash
ssh -t -t  nsccgz_zgchen_2@172.16.20.102 -L 8014:localhost:8014 -i nsccgz_zgchen_2.id ssh 89.72.32.22  -L 8014:127.0.0.1:8014
```
这里 nsccgz_zgchen_2 是中间登录节点的用户名，172.16.20.102是中间登录节点的IP， 89.72.32.22是计算节点的IP，8014是port号可以换成你自己喜欢的数字。

计算节点的ip一般是不知道的，可以通过如下方式获得：
```bash
cat /etc/hosts | grep node/to/search
```
即可看到计算节点对应的IP。

建立隧道完成后，在本地浏览器输入如下代码（直接复制控制台输出的带 token 的 url)，即可成功访问。
```bash
http://127.0.0.1:8014/lab?token=21681991a64b81f2651111c7015dfa948bc4f139bd9a110f
```
![](https://cuterwrite-1302252842.file.myqcloud.com/brain-sim/images/1821554a013fd0d7f6e2eae8aa997514.png)
然后你就可以流畅地在上面使用 python 编写交互式程序了。
