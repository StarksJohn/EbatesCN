/**
 * Created by Ebates on 16/12/1.
 *
 * 创建 全局变量 storage, 用于db,只需
 * https://github.com/sunnylqm/react-native-storage/issues/29
 * https://github.com/sunnylqm/react-native-storage/blob/master/README-CHN.md 中文文档
 */

import Storage from 'react-native-storage';
import {AsyncStorage} from 'react-native';
import sync from './sync'

var storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，单位是 毫秒, 默认一整天（1000 * 3600 * 24 ）毫秒，设为null则永不过期
    defaultExpires: null, //1000 * 3600 * 24,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // 你可以在构造函数这里就写好sync的方法
    // 或是写到另一个文件里，这里require引入
    // 或是在任何时候，直接对storage.sync进行赋值修改
    // sync: require('./sync')
    // 就是 具体 某个业务逻辑接口 的 获取数据的方法,在没接口数据时 调用请求具体接口数据,最好在外部 文件里
    sync:sync
    // {
        // sync里方法的名字必须和所存数据的key完全相同
        // 方法接受的参数params为一整个object，所有参数从object中解构取出
        // 这里可以使用promise。或是使用普通回调函数，但需要调用resolve或reject。
        // 如 有了user 这个sync方法，以后再调用storage.load时，如果本地并没有存储相应的user，那么会自动触发storage.sync.user去远程取回数据并无缝返回。
        // user(params){
        //     let {id, resolve, reject} = params;
        //     fetch('user/', {
        //         method: 'GET',
        //         body: 'id=' + id
        //     }).then(response => {
        //         return response.json();
        //     }).then(json => {
        //         //console.log(json);
        //         if (json && json.user) {
        //             storage.save({
        //                 key: 'user',
        //                 id,
        //                 rawData: json.user
        //             });
        //             // 成功则调用resolve
        //             resolve && resolve(json.user);
        //         }
        //         else {
        //             // 失败则调用reject
        //             reject && reject(new Error('data parse error'));
        //         }
        //     }).catch(err => {
        //         console.warn(err);
        //         reject && reject(err);
        //     });
        // }
    // }
});


// 最好在全局范围内创建一个（且只有一个）storage 实例，方便直接调用
// 对于react native
// 这样，在此**之后**的任意位置即可以直接调用storage
// 注意：全局变量一定是先声明，后使用
// 如果你在某处调用storage报错未定义
// 请检查global.storage = storage语句是否确实已经执行过了
global.storage = storage;


