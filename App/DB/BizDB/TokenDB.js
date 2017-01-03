/**
 * Created by Ebates on 17/1/3.
 *
 * 处理 token的 数据库 操作
 */

const UnLoginStateToken = 'unLoginStateToken';// 未登录状态下 的token 的key
/**
 * token的 统一数据结构
 * @type {{token_type: string, expires_in: number, access_token: string, refresh_token: string}}
 */
export const tokenSchema = {
    token_type: '',
    expires_in: 0,
    access_token: '',
    refresh_token: ''
}

/**
 * 缓存一个 未登录状态token 数据结构
 * @param tokenSchema
 */
export function saveUnLoginStateToken(tokenSchema) {
    gBizStorage.saveStorage(UnLoginStateToken, '', tokenSchema, tokenSchema.expires_in);
}

/**
 * 读取 非登录token的缓存
 * @returns {Promise}
 */
export function loadUnLoginStateToken() {
    return new Promise(
        (resolve, reject) => {
            gBizStorage.loadStorage(UnLoginStateToken, '', true, false).then((result)=> {
                resolve(result);
            }).catch(err => {
                reject(err);
            })
        }
    );
}