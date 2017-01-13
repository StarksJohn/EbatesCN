/**
 * Created by Ebates on 17/1/3.
 * HistorySearchDB
 * 处理 历史搜索 列表的 数据库 操作
 */
// import  ArrayUtils from '../../Utils/ArrayUtils'


const historySearchDBKey = 'HistorySearchDB';// 历史搜索 DB 的key

/**
 * 缓存一个 历史搜索的 关键字
 * @param word 关键字
 * @returns {Promise}
 */
export function saveHistoryDB(word,handeler) {
    return new Promise(
        (resolve, reject) => {
            this.loadHistoryDB().then((rawData)=> {

                if (rawData.isContainValue(word)==false) {//重复的关键字不添加到数组开头

                    rawData.unshift(word);//插入到数组开头
                    if (rawData.length > 3) {
                        rawData.pop();//删除最后一个
                    }

                    // Log.log('saveHistoryDB ok   rawData== '+rawData );

                    gBizStorage.saveStorage(historySearchDBKey, '', rawData, null);

                    resolve(handeler);

                }else{
                    reject(handeler);
                }

            }).catch((e,handeler)=> {
                if (e.name == 'NotFoundError') {//没 缓存
                    gBizStorage.saveStorage(historySearchDBKey, '', Array.from([word]), null);
                    resolve(handeler);
                }
            });
        }
    );



}

/**
 * 读取 历史搜索 列表的 缓存
 * @returns {Promise}
 */
export function loadHistoryDB() {
    return new Promise(
        (resolve, reject) => {
            gBizStorage.loadStorage(historySearchDBKey, '', false, false).then((rawData)=> {
                resolve(rawData);
            }).catch(err => {
                reject(err);
            })
        }
    );
}

/**
 *  * 读取 历史搜索 列表的 缓存,不返回 Promise 对象 ,直接返回值 ,但 因 底层 loadStorage是异步的,故 外部 不能 用
 * @returns {Array}
 */
// export function loadHistoryDBWithoutPromise() {
//     gBizStorage.loadStorage(historySearchDBKey, '', false, false).then((rawData)=> {
//         Log.log('loadHistoryDBWithoutPromise =='+ Log.writeObjToJson(rawData));
//         return rawData;
//     }).catch(err => {
//         Log.log('loadHistoryDBWithoutPromise == [] ');
//         return [];
//     })
//     return [];
// }