/**
 * Created by Ebates on 16/12/8.
 * UserDB
 * 用户数据库的 内存及硬盘缓存数据 结构
 */
import *as StringOauth from '../../Utils/StringUtils/StringOauth'

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

        }

    }