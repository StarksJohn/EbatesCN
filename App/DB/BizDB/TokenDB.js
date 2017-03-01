/**
 * Created by Ebates on 17/1/3.
 * TokenDB
 * 处理 token的 数据库 操作
 */

const UnLoginStateToken = 'unLoginStateToken';// 未登录状态下 的token 的key
export const UnLoginTokenclient_id='1';//
export const UnLoginTokenclient_secret='bZRiVM1KmHFFmdpjJDcbh78gyHRwoqAvlIarXOb1';//获取未登录token接口需要上传的数据

/**
 * 内存里的 未登陆的 token的 统一数据结构
 * @type {{token_type: string, expires_in: number, access_token: string, refresh_token: string}}
 */
export const unLoginTokenSchema = {
    data:{
        token_type: '',
        expires_in: 0,
        access_token: '',
    },

    /**
     * 判断 未登录token 是否过期:true 过期
     * @returns {boolean}
     */
    isExpires(){
        Log.log('TokenDB isExpires() 正在判断 未登录token 是否过期  this.data.expires_in='+this.data.expires_in+ '   new Date().getTime()='+new Date().getTime())
        return this.data.expires_in < new Date().getTime()/*获取当前时间*/;
    }

}

/**
 * 登陆后的 token的 统一数据结构
 * @type {{token_type: string, expires_in: number, access_token: string, refresh_token: string}}
 */
export const loginTokenSchema = {
    data:{
        token_type: '',
        expires_in: 0,
        access_token: '',
        refresh_token: '',
    },

    /**
     * 判断 未登录token 是否过期:true 过期
     * @returns {boolean}
     */
    isExpires(){
        return this.expires_in < new Date().getTime()/*获取当前时间*/;
    },

    //登录后token能否使用
    available(){
       return this.data.expires_in!=0;
    }
}

/**
 * 判断当前可用的是哪个token对象
 * @returns {{token_type: string, expires_in: number, access_token: string, refresh_token: string}}
 */
export function getAvailableToken() {
    return loginTokenSchema.available()?loginTokenSchema:unLoginTokenSchema;
}

/**
 * 缓存一个 未登录状态token 数据结构
 * @param tokenSchema
 */
export function saveUnLoginStateToken(tokenSchema) {
    // Log.log('TokenDB  saveUnLoginStateToken tokenSchema =' + Log.writeObjToJson(tokenSchema));

    //因以后调 gBizStorage.loadStorage 拿到只是 tokenSchema,而自己 想判断  是否过期,必须 和  storage.js里 的 save(params)方法一样, 修改 tokenSchema.expires_in为 当前毫秒时间+服务器发来的多少毫秒后过期,如 let now = new Date().getTime(); data.expires = now + expires; 以后 从 缓存 拿到 tokenSchema 后, tokenSchema.expires_in 就是 真正我能用 毫秒判断的 过期时间
    let now = new Date().getTime();
    //模拟过期的时间为5秒后过期
    // tokenSchema.expires_in=5;

    // let newTokenSchema
    unLoginTokenSchema.data={...tokenSchema,expires_in:now + tokenSchema.expires_in * 1000};

    // Log.log('TokenDB saveUnLoginStateToken 准备缓存最新的非登录token ='+ Log.writeObjToJson(newTokenSchema));

    gBizStorage.saveStorage(UnLoginStateToken, '', unLoginTokenSchema.data, tokenSchema.expires_in/*服务器发来的是 秒,故得换算成 毫秒再缓存*/ * 1000 );

    // unLoginTokenSchema.data=newTokenSchema;
    Log.log('TokenDB saveUnLoginStateToken unLoginTokenSchema.data='+ Log.writeObjToJson(unLoginTokenSchema.data));
    BizShowToast('TokenDB saveUnLoginStateToken 缓存未登录token成功, unLoginTokenSchema.data= '+Log.writeObjToJson(unLoginTokenSchema.data));
}

/**
 * 读取 非登录token的缓存,过期会自动 调 sync 的 unLoginStateToken()
 * @returns {Promise}, 外部调 loadUnLoginStateToken 时 也得 加 then()
 */
export function loadUnLoginStateToken() {
    return new Promise(
        (resolve, reject) => {
            gBizStorage.loadStorage(UnLoginStateToken, '', true, false).then((result) => {
                //noinspection JSAnnotator,JSAnnotator
                unLoginTokenSchema.data={...result};
                resolve(unLoginTokenSchema.data);
            }).catch(err => {
                reject(err);
            })
        }
    );
}