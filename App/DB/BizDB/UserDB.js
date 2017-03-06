/**
 * Created by Ebates on 16/12/8.
 * UserDB
 * 用户数据库的 内存及硬盘缓存数据 结构
 */
import *as StringOauth from '../../Utils/StringUtils/StringOauth'
import *as TokenDB from './TokenDB'

/**
 * 用户数据的 内存缓存 结构, 不是 硬盘缓存
 * @type {{properties: {userID: string, nickname: string, loginPlatform: string, icon: string, Gender: string, url: string}, isLogin: (()), login: ((userData)), logOut: (())}}
 */
export default UserSchema =
    {
        tableName: 'UserSchema', //数据库的表名
        properties: {
            userID: '',//账号
            password: '',
            nickname: '', //
            loginPlatform: '',//第三方登录平台
            icon: '',
            Gender: '',//性别 f:女 m: 男
            url: '',//个人主页
        },

        /**
         * 是否登陆
         */
        isLogin(){
            let tableName=this.tableName;
            let properties=this.properties;
            return new Promise(
                (resolve, reject) => {
                    if ((StringOauth.isNull(properties.userID) || properties == null)) {//内存里没有properties数据
                        gBizStorage.loadStorage(tableName, '', false, false).then(//读缓存
                            (result) => {//有缓存
                                UserSchema.properties = result;
                                resolve(true);
                            },
                        ).catch(err => {//无缓存
                            reject(err);
                        })
                    } else {//内存里有用户数据
                        resolve(true);
                    }
                }
            );
        },

        /**
         * 登陆成功后调
         * @param userData
         */
        login(userData){
            this.properties = {...this.properties, ...userData}//扩展运算符,合并对象属性
            Log.log('UserDB UserSchema login 登陆成功 this.properties===' + Log.writeObjToJson(this.properties));

            gBizStorage.saveStorage(this.tableName, '', this.properties, null);
        },

        /**
         * 清除缓存和内存数据
         */
        logOut(){
            this.properties = null;
            Log.log('logOut this.properties===' + Log.writeObjToJson(this.properties));
            gBizStorage.removeStorage(this.tableName,'');
            Log.log('UserDB UserSchema logOut 已清除 内存和缓存里的用户数据')

            //先 检测 内存里 有没有 未登录token
            if (!TokenDB.unLoginTokenSchema.available()) {//先判断内存里 有没有 未登录token
                TokenDB.loadUnLoginStateToken().then((tokenObj) => { //内存里没有 未登录token, 先得 从缓存里读取,过期会自动 调 sync 的 unLoginStateToken()
                    Log.log('TokenAPI getTokenWhenAppOpen 读取 unLoginTokenSchema.data 的 缓存成功 =' + Log.writeObjToJson(tokenObj));

                }).catch((e) => {
                    if (e.name == 'NotFoundError') {//未登录状态的token在 缓存里没有
                        Log.log('UserDB logOut 注销后, 缓存里 没有 未登录 token,开始 调 未登录 token 接口 拿 token 并 缓存,内存赋值')

                        gStorage.sync.unLoginStateToken().then((tokenObj) => {
                        });
                    }
                });
            }else{//内存里有 未登录token, 判断是否过期
                if(TokenDB.unLoginTokenSchema.isExpires()){//过期
                    TokenDB.unLoginTokenSchema.refreshToken().then(
                        Log.log('UserDB logOut 注销后, 未登录token 刷新 成功 ')
                    ).catch((error) => {
                        reject(error);
                    });
                }else{
                    Log.log('UserDB logOut 注销后, 内存里 的 未登录token  未过期, TokenDB.unLoginTokenSchema.data=='+Log.log(TokenDB.unLoginTokenSchema.data))
                }
            }
        }

    }