/**
 * Created by Ebates on 17/3/3.
 * StringUtils
 */

// 通过原型创建字符串的trim() 去除字符串两边的空白 http://blog.csdn.net/mafan121/article/details/51648003
//但系统就有此方法,故不需要
// String.prototype.trim=function(){
//     return this.replace(/(^\s*)|(\s*$)/g, "");
// }

//只去除字符串左边空白
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
}

//只去除字符串右边空白
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");

}