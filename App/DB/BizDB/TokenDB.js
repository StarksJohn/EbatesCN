/**
 * Created by Ebates on 17/1/3.
 * TokenDB
 * 处理 token的 数据库 操作
 */

const UnLoginStateToken = 'unLoginStateToken';// 未登录状态下 的token 的key
/**
 * 未登陆的 token的 统一数据结构
 * @type {{token_type: string, expires_in: number, access_token: string, refresh_token: string}}
 */
export const unLoginTokenSchema = {
    data:{
        token_type: '',
        expires_in: 0,
        access_token: '',
        refresh_token: '',
        client_id:'1',//获取未登录token接口需要上传的数据
        client_secret:'bZRiVM1KmHFFmdpjJDcbh78gyHRwoqAvlIarXOb1'//获取未登录token接口需要上传的数据
    },

    /**
     * 判断 未登录token 是否过期:true 过期
     * @returns {boolean}
     */
    isExpires(){
        return this.expires_in < new Date().getTime()/*获取当前时间*/;
    }
}

/**
 * 缓存一个 未登录状态token 数据结构
 * @param tokenSchema
 */
export function saveUnLoginStateToken(tokenSchema) {
    // Log.log('TokenDB  saveUnLoginStateToken tokenSchema =' + Log.writeObjToJson(tokenSchema));

    gBizStorage.saveStorage(UnLoginStateToken, '', tokenSchema, tokenSchema.expires_in/*服务器发来的是 秒,故得换算成 毫秒再缓存*/ * 1000 /*10 *
     1000*/);

    unLoginTokenSchema.data={...tokenSchema,expires_in:tokenSchema.expires_in/*服务器发来的是 秒,故得换算成 毫秒再缓存*/ * 1000};
    Log.log('TokenDB saveUnLoginStateToken unLoginTokenSchema.data='+ Log.writeObjToJson(unLoginTokenSchema.data));
}

/**
 * 读取 非登录token的缓存
 * @returns {Promise}, 外部调 loadUnLoginStateToken 时 也得 加 then()
 */
export function loadUnLoginStateToken() {
    return new Promise(
        (resolve, reject) => {
            gBizStorage.loadStorage(UnLoginStateToken, '', true, false).then((result) => {
                //noinspection JSAnnotator,JSAnnotator
                unLoginTokenSchema.data={...result};
                Log.log('TokenDB loadUnLoginStateToken unLoginTokenSchema.data='+unLoginTokenSchema.data);
                resolve(unLoginTokenSchema);
            }).catch(err => {
                reject(err);
            })
        }
    );
}