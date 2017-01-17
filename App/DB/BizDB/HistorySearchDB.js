/**
 * Created by Ebates on 17/1/3.
 * HistorySearchDB
 * 处理 历史搜索 列表的 数据库 操作
 */
// import  ArrayUtils from '../../Utils/ArrayUtils'


const historySearchDBKey = 'HistorySearchDB';// 历史搜索 DB 的key
export const historySearchKeyWordCellNums = 8;// 历史搜索关键词cell的 数量


/**
 * 缓存一个 历史搜索的 关键字
 * @param word 关键字
 * @returns {Promise}
 */
export function saveHistoryDB(word) {
    return new Promise(
        (resolve, reject) => {
            this.loadHistoryDB().then((rawData)=> {

                if (rawData.isContainValue(word)==false) {//重复的关键字不添加到数组开头,不缓存

                    rawData.unshift(word);//插入到数组开头
                    if (rawData.length > historySearchKeyWordCellNums) {//业务逻辑 缓存8个
                        rawData.pop();//删除最后一个
                    }

                    // Log.log('saveHistoryDB ok   rawData== '+rawData );

                    gBizStorage.saveStorage(historySearchDBKey, '', rawData, null);

                    resolve();

                }else{
                    reject();
                }

            }).catch((e)=> {
                if (e.name == 'NotFoundError') {//没 缓存
                    gBizStorage.saveStorage(historySearchDBKey, '', Array.from([word]), null);

                    // Log.log('e.name == NotFoundError  handeler =='+handeler);
                    resolve();
                }
            });
        }
    );
}

/**
 * 缓存里删除一个 关键字
 * @param word
 * @returns {Promise}
 */
export function deleteOneKeyWordFromHistoryDB(word) {
    return new Promise(
        (resolve, reject) => {
            this.loadHistoryDB().then((rawData)=> {

                if (rawData.isContainValue(word)) {//

                    rawData.remove(word);//remove是 本项目的 ArrayUtils.js 里 自己添加的 方法

                    if (rawData.length<=0){
                        this.clearHistoryDB();
                    }else{
                        gBizStorage.saveStorage(historySearchDBKey, '', rawData, null);
                    }

                    resolve(rawData);

                }else{
                    reject(rawData);
                }

            }).catch((e)=> {
                if (e.name == 'NotFoundError') {//没 缓存
                    resolve([]);
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
 * 清除 关键字列表的缓存
 */
export function clearHistoryDB() {
    gBizStorage.removeStorage(historySearchDBKey, '');

}