/**
 * Created by Ebates on 17/1/3.
 * TokenDB
 * 处理 token的 数据库 操作
 */

const UnLoginStateToken = 'unLoginStateToken';// 未登录状态下 的token 的key
const LoginStateToken = 'LoginStateToken';// 登录状态下 的token 的key
export const UnLoginTokenclient_id = '1';//
export const UnLoginTokenclient_secret = 'bZRiVM1KmHFFmdpjJDcbh78gyHRwoqAvlIarXOb1';//获取未登录token接口需要上传的数据

export const LoginTokenclient_id = '2';//
export const LoginTokenclient_secret = 'R1T4xnle224xNLUm0Oq6joS7EhcK28wdUeodzj0u';//获取登录token接口需要上传的数据

/**
 * 内存里的 未登陆的 token的 统一数据结构
 * @type {{token_type: string, expires_in: number, access_token: string, refresh_token: string}}
 */
export const unLoginTokenSchema = {
    name:'未登录token',
    data: {
        token_type: '',
        expires_in: 0,//针对的是 access_token 的过期时间
        access_token: '',
    },
    //内存里非登录token能否使用
    available(){
        return this.data.expires_in != 0;
    },

    /**
     * 判断 未登录token 是否过期:true 过期
     * @returns {boolean}
     */
    isExpires(){
        Log.log('TokenDB unLoginTokenSchema isExpires() 正在判断 未登录token 是否过期  this.data.expires_in=' + this.data.expires_in + '   new Date().getTime()=' + new Date().getTime()+'   '+this.expires_in < new Date().getTime())
        return this.data.expires_in < new Date().getTime()/*获取当前时间*/;
    },

    /**
     * 过期后刷新token
     */
    refreshToken(){
        return new Promise(
            (resolve, reject) => {
                storage.sync.unLoginStateToken().then((tokenObj) => {
                    Log.log('TokenDB unLoginTokenSchema refreshToken 未登录token 刷新成功')
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
            }
        );
    }
}

/**
 * 登陆后的 token的 统一数据结构
 * @type {{token_type: string, expires_in: number, access_token: string, refresh_token: string}}
 */
export const loginTokenSchema = {
    name:'已登录token',

    data: {
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
        Log.log('TokenDB loginTokenSchema isExpires() 正在判断 内存里的登录token 是否过期  this.data.expires_in=' + this.data.expires_in + '   new Date().getTime()=' + new Date().getTime()+'   '+this.expires_in < new Date().getTime());

        return this.expires_in < new Date().getTime()/*获取当前时间*/;
    },

    //内存里登录后token能否使用
    available(){
        return this.data.expires_in != 0;
    },
    /**
     * 过期后刷新token
     */
    refreshToken(){
        return new Promise(
            (resolve, reject) => {
                // storage.sync.unLoginStateToken().then((tokenObj) => {
                //     resolve();
                // });
            }
        );
    }
}

/**
 * 判断当前可用的是哪个token对象,登录token有数据,就优先用登录token
 * @returns {{token_type: string, expires_in: number, access_token: string, refresh_token: string}}
 */
export function getAvailableToken() {
    return loginTokenSchema.available() ? loginTokenSchema : unLoginTokenSchema;
}

/**
 * 缓存一个 未登录状态token 数据结构,并更新 内存里的 非登录token
 * @param tokenSchema
 */
export function saveUnLoginStateToken(tokenSchema) {
    // Log.log('TokenDB  saveUnLoginStateToken tokenSchema =' + Log.writeObjToJson(tokenSchema));

    //因以后调 gBizStorage.loadStorage 拿到只是 tokenSchema,而自己 想判断  是否过期,必须 和  storage.js里 的 save(params)方法一样, 修改 tokenSchema.expires_in为 当前毫秒时间+服务器发来的多少毫秒后过期,如 let now = new Date().getTime(); data.expires = now + expires; 以后 从 缓存 拿到 tokenSchema 后, tokenSchema.expires_in 就是 真正我能用 毫秒判断的 过期时间
    let now = new Date().getTime();
    //模拟过期的时间为5秒后过期
    // tokenSchema.expires_in=5;

    // let newTokenSchema
    unLoginTokenSchema.data = {...tokenSchema, expires_in: now + tokenSchema.expires_in * 1000};

    // Log.log('TokenDB saveUnLoginStateToken 准备缓存最新的非登录token ='+ Log.writeObjToJson(newTokenSchema));

    gBizStorage.saveStorage(UnLoginStateToken, '', unLoginTokenSchema.data, tokenSchema.expires_in/*服务器发来的是 秒,故得换算成 毫秒再缓存*/ * 1000);

    // unLoginTokenSchema.data=newTokenSchema;
    Log.log('TokenDB saveUnLoginStateToken unLoginTokenSchema.data=' + Log.writeObjToJson(unLoginTokenSchema.data));
    BizShowToast('TokenDB saveUnLoginStateToken 缓存未登录token成功, unLoginTokenSchema.data= ' + Log.writeObjToJson(unLoginTokenSchema.data));
}

/**
 * 缓存一个 登录后状态token 数据结构,并更新 内存里的 登录token
 * @param tokenSchema
 */
export function saveLoginStateToken(tokenSchema) {
    // Log.log('TokenDB  saveUnLoginStateToken tokenSchema =' + Log.writeObjToJson(tokenSchema));

    //因以后调 gBizStorage.loadStorage 拿到只是 tokenSchema,而自己 想判断  是否过期,必须 和  storage.js里 的 save(params)方法一样, 修改 tokenSchema.expires_in为 当前毫秒时间+服务器发来的多少毫秒后过期,如 let now = new Date().getTime(); data.expires = now + expires; 以后 从 缓存 拿到 tokenSchema 后, tokenSchema.expires_in 就是 真正我能用 毫秒判断的 过期时间
    let now = new Date().getTime();
    //模拟过期的时间为5秒后过期
    tokenSchema.expires_in=5;

    loginTokenSchema.data = {...tokenSchema, expires_in: now + tokenSchema.expires_in * 1000};

    gBizStorage.saveStorage(LoginStateToken, '', loginTokenSchema.data, tokenSchema.expires_in/*服务器发来的是 秒,故得换算成 毫秒再缓存*/ * 1000);

    // unLoginTokenSchema.data=newTokenSchema;
    Log.log('TokenDB saveLoginStateToken 缓存登录后的token LoginStateToken.data=' + Log.writeObjToJson(loginTokenSchema.data));
    // BizShowToast('TokenDB saveUnLoginStateToken 缓存未登录token成功, unLoginTokenSchema.data= '+Log.writeObjToJson(unLoginTokenSchema.data));
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
                unLoginTokenSchema.data = result;
                resolve(unLoginTokenSchema.data);
            }).catch(err => {
                reject(err);
            })
        }
    );
}

/**
 * 读取 登录后token 的缓存,过期会自动 调 sync 的 LoginStateToken() 刷新 登录后 token
 * @returns {Promise}, 外部调 loadUnLoginStateToken 时 也得 加 then()
 */
export function loadLoginStateToken() {
    return new Promise(
        (resolve, reject) => {
            gBizStorage.loadStorage(LoginStateToken, '', true, true).then((result) => {
                //noinspection JSAnnotator,JSAnnotator
                Log.log('TokenDB loadLoginStateToken result 可能过期='+Log.writeObjToJson(result));
                loginTokenSchema.data = result;//因 loadStorage函数最后一参数是true,故即使 result 过期, 也会 先把缓存里的数据拿出来用,如果过期,会在
                // sync里自动回调LoginStateToken() 刷新登录token
            }).catch(err => {
                // let aaa=JSON.parse(err.message);
                reject(err);
            })
        }
    );
}

// function  refreshLoginStateToken(){
//     return new Promise(
//         (resolve, reject) => {
//             Log.log('sync LoginStateToken 登录token 在 内存 里判断过期,需要重新 调 getRefreshToken 接口拿 新的 登录后 token')
//
//             let getRefreshToken=()=>{
//                 Log.log('sync LoginStateToken  开始 调 刷新 登录 token 的 接口');
//                 BizApi.LogInApi.getRefreshToken().then(
//                     (responseData) => {
//                         Log.log('sync LoginStateToken 刷新 登录 token 成功,  responseData=' + Log.writeObjToJson(responseData))
//                         resolve(responseData);
//                     }
//                 ).catch((error) => {
//                     reject(error);
//                 });
//             };
//
//             //检测未登录token是否合法 &&  刷新 登录 token
//             let checkUnLoginTokenSchema=()=>{
//                 if (!TokenDB.unLoginTokenSchema.isExpires()) {//内存里 未登陆token 未过期
//                     getRefreshToken();
//                 } else {//未登陆token 已过期,刷新 未登陆 token
//                     TokenDB.unLoginTokenSchema.refreshToken().then(
//                         () => {
//                             getRefreshToken();
//                         }
//                     ).catch((error) => {
//                         reject(error);
//                     });
//                 }
//             }
//
//             if (TokenDB.unLoginTokenSchema.available()) {//因 getRefreshToken()刷新登录token接口 里需要 未登录token,故先判断内存里的未登录token是否可用
//                 checkUnLoginTokenSchema();
//
//             } else {//内存里没有 未登录token, 先得 从缓存里读取
//                 TokenDB.loadUnLoginStateToken().then((tokenObj) => {
//                     Log.log('TokenAPI getTokenWhenAppOpen 读取 unLoginTokenSchema.data 的 缓存成功 =' + Log.writeObjToJson(tokenObj));
//                     checkUnLoginTokenSchema();
//
//                 }).catch((e) => {
//                     if (e.name == 'NotFoundError') {//未登录状态的token没有
//                         storage.sync.unLoginStateToken().then((tokenObj) => {
//                             getRefreshToken();
//                         });
//                     }
//                 });
//             }
//         }
//     );
//
// }