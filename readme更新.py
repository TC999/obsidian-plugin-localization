# -*- coding: UTF-8 -*-

import json
import os.path


# 返回子所有子目录完整路径，path为你的路径
def getFirstDir(path):
    list = []
    if (os.path.exists(path)):              # 判断路径是否存在
        files = os.listdir(path)
        for file in files:
            m = os.path.join(path, file)
            if (os.path.isdir(m)):          # 判断该路径下是否是文件夹
                list.append(m)
        return list


# 读取 manifest.json 获取插件的名称、描述、中文描述、项目地址
def getPluginInf(path):
    list = getFirstDir(path)
    str = ''
    for l in list:
        print(l)
        dirName = os.path.split(l)[1]    # 取文件夹名（已带版本号）
        file = open(l + "\\manifest.json", 'r', encoding='utf-8')
        c = json.load(file)
        pluginInf = F'|{c["name"]}|{c["description"]}|{dirName}|{c["authorUrl"]}|'
        file.close()
        str += pluginInf + '\n'
    return str



str1 = '''
# Obsidian 插件汉化

Obsidian 有很多很好用的插件，但大多都是英文的，而本人英文烂到掉渣🤣🤣，所以弄了这个自用，有同样需求的请自取。
插件里的英文全部为机翻加上个人的理解并修改，如有问题请提出来。插件太多，看心情汉化🤣🤣🤣

**说明**：本项目里所有插件都是由 “宏沉一笑” 整理好的，原项目地址： https://gitee.com/whghcyx/obsidian-plugin ，我只是搬运下来作汉化（机翻）处理。

# 已汉化插件
|名称|描述|文件夹（带版本号）|项目地址|
|----|----|------------------|--------|
'''

str3 = '''

# 待汉化插件
|名称|描述|文件夹（带版本号）|项目地址|
|----|----|------------------|--------|
'''

str2 = getPluginInf("已汉化插件\\")
str4 = getPluginInf("待汉化插件\\")

readmeFile = open("README.md",'w', encoding='utf-8')
readmeFile.write(str1 + str2 + str3 + str4)
readmeFile.close()

print("更新完成")