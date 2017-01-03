/**
 * Created by Ebates on 16/12/8.
 *
 * 用户数据库的 内存及硬盘缓存数据 结构
 */
import *as StringOauth from '../../Utils/StringUtils/StringOauth'

/**
 * 用户数据的 内存缓存 结构, 不是 硬盘缓存
 * @type {{properties: {userID: string, nickname: string, loginPlatform: string, icon: string, Gender: string, url: string}, isLogin: (()), login: ((userData)), logOut: (())}}
 */
export default UserSchema =
{
    tableName:'UserSchema', //表名
    properties: {
        userID: '',
        nickname: '', //
        loginPlatform: '',//第三方登录平台
        icon: '',
        Gender: '',//性别 f:女 m: 男
        url: '',//个人主页
    },

    isLogin(){
        //noinspection JSValidateTypes
        // return !(null === this.properties); //isEmptyObj.isEmpty(this.properties.userID);
        return !(StringOauth.isNull(this.properties.userID) || this.properties==null);
    },

    login(userData){
        this.properties = {...this.properties, ...userData}//扩展运算符,合并对象属性
        Log.log('login this.properties==='+Log.writeObjToJson(this.properties));
    },

    logOut(){
        this.properties = null;
        Log.log('logOut this.properties==='+Log.writeObjToJson(this.properties));

    }

}