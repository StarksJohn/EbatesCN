/**
 * Created by Ebates on 16/12/13.
 * ArrayUtils
 * 数组的扩展方法
 */

/**
 * 返回 2个数组里相同的元素
 * @param array2
 * isSame : true: 返回相同的元素; false:返回不同元素
 * @returns {Array}
 */
Array.prototype.filterSameEle =function (array2) {
    //临时数组存放
    var tempArray1 = [];//临时数组1
    var tempArray2 = [];//临时数组2

    for(var i=0;i<array2.length;i++){
        tempArray1[array2[i]]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
    }

    for(var i=0;i<this.length;i++){
        if(tempArray1[this[i]]){
            tempArray2.push(this[i]);//过滤array1 中与array2 相同的元素；
        }
    }

    return tempArray2;
}

/**
 * http://www.cnblogs.com/yeyuchangfeng/p/6237819.html
 * 数组是否包含某对象
 * @param v
 * @returns {*|Number|number}
 */
Array.prototype.isContainValue = function ( v ) {
    for (let i in this) {
        // Log.log('i下标  ='+i + ' arr[i] '+this[i] );

        if (this[i] === v){
            Log.log(this+' 里 包含 ='+v);

            return true;
        }
    }

    // Log.log('isContainValue false  '+v);

    return false;
}