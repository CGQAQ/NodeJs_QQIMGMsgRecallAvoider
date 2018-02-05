// author: CG
fs = require('fs')
os = require('os')
path = require('path')

let HOMEDIR = os.homedir()
let QQNumber = process.argv[2]
let targetpath = path.join(HOMEDIR, 'Documents', 'Tencent Files', QQNumber, 'Image', 'Group')
let backuppath = path.join(HOMEDIR, 'Documents', 'backup')

if(QQNumber === null){
    console.error('请输入你的qq号!\n e.g. node xxxx.js xxxxxxxxxx');
}

fs.access(backuppath, callback = err => {
    if(err) fs.mkdir(backuppath, callback = err =>{
        console.log(backuppath, '创建失败！')
    })
})

fs.watch(targetpath, {recursive:true}, (eventType, filename)=>{
    //console.log('type: ', eventType, ', name: ', filename)
    if(eventType === 'rename'){
        // console.log(filename+':changed')
        if(filename.endsWith('1688')) return;
        fs.copyFile(path.resolve(targetpath, filename), path.resolve(backuppath, filename), err => {
            if(err){
                console.log(backuppath, filename, ' 被撤回了！');
            }
        })
    }
})

setInterval(() => {
    fs.readdir(backuppath, callback = (err, files) => {
        if(!err){
            files.forEach(element => {
                let currentfile = path.resolve(backuppath, element)
                fs.stat(currentfile, (err, stats) =>{
                    if(!err){
                        if(Date.now() - stats.birthtimeMs > 1000*60*4){
                            fs.unlink(currentfile, err => {
                                if(err){
                                    console.log('删除文件：', currentfile, '失败！')
                                }
                                else{
                                    console.log('已删除：', currentfile)
                                }
                               
                            })
                        }
                    }
                })
            });
        }
        else{
            console.error('遍历文件夹出错！')
        }
    })
}, 1000*5);