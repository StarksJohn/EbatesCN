/**
 * Created by Ebates on 16/12/1.
 */
import Storage from '../../CommonDB/Storage'

/**
 * 业务逻辑 层 通用的 基于 Storage 的 读取 某个 key  数据
 * @param key
 * @param id 没有时传 ''
 * @param autoSync
 * @param syncInBackground
 * @returns {Promise}
 */
export const loadStorage = (key, id, autoSync, syncInBackground) => {
    // let isOk;
    return new Promise(
        (resolve, reject) => {
            // 读取
            storage.load({
                key: key, //global.UserSchema,
                id: id,

                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: autoSync, //false,

                // syncInBackground(默认为true)意味着如果数据过期，
                // 在调用sync方法的同时先返回已经过期的数据。
                // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
                syncInBackground: syncInBackground, // true
            }).then(ret => {
                // 如果找到数据，则在then方法中返回
                // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                // 你只能在then这个方法内继续处理ret数据
                // 而不能在then以外处理
                // 也没有办法“变成”同步返回
                // 你也可以使用“看似”同步的async/await语法

                Log.log('loadCachedata OK ===' + ret);
                // dispatch(LogInAction(ret));
                resolve(ret);
            }).catch(err => {
                //如果没有找到数据且没有sync方法，
                //或者有其他异常，则在catch中返回
                Log.log('loadCachedata.err===' + err.message);
                switch (err.name) {
                    case 'NotFoundError': {
                        Log.log('loadCachedata.NotFoundError');
                        reject(err);
                    }
                        break;
                    case 'ExpiredError':
                        Log.log('loadCachedata.ExpiredError');
                        break;
                }
            });
        });
};

/**
 * 使用key和id来保存数据，一般是保存同类别（key）的大量数据。
 * @param key
 * @param id: 没有时传 ''
 * @param rawData
 * @param expires
 */
export const saveStorage = (key, id, rawData, expires) => {
    storage.save({
        key: key, //global.UserSchema  表名
        id: id,
        rawData: rawData,// result:一行数据,不能改名

        // 如果不指定过期时间，则会使用defaultExpires参数
        // 如果设为 null，则永不过期
        expires: expires //null //1000 * 3600
    });
};

/**
 * 删除单个数据
 * @param key
 * @param id
 */
export const removeStorage = (key, id)=> {
    storage.remove({
        key: key,
        id: id
    });
}

// 获取某个key下的所有id
export const getIdsForKey = (key)=> {
    return new Promise(
        (resolve, reject) => {
            storage.getIdsForKey(key)
                .then(ids => {
                    resolve(ids);

                }).catch(err => {
                //如果没有找到数据且没有sync方法，
                //或者有其他异常，则在catch中返回
                switch (err.name) {
                    case 'NotFoundError': {
                        Log.log('getIdsForKey.NotFoundError');
                        reject(err);
                    }
                        break;
                    case 'ExpiredError':
                        // TODO
                        break;
                }
            });
        }
    );

}

// 获取某个key下的所有数据
export const getAllDataForKey = (key)=> {
    return new Promise(
        (resolve, reject) => {
            storage.getAllDataForKey(key)
                .then(datas => {
                    resolve(datas);

                }).catch(err => {
                //如果没有找到数据且没有sync方法，
                //或者有其他异常，则在catch中返回
                switch (err.name) {
                    case 'NotFoundError': {
                        Log.log('getAllDataForKey.NotFoundError');
                        reject(err);
                    }
                        break;
                    case 'ExpiredError':
                        // TODO
                        break;
                }
            });
        }
    );

}

