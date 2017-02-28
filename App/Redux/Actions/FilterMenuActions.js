/**
 * Created by Ebates on 17/2/22.
 * FilterMenuActions
 */
import Colors from '../../Utils/Colors'



/**
 * 改变数组元素,元素是 {id:0, title:'国家'} 类型, 改的其实是 title字段
 * @type {string}
 */
export const  changeModel='changeModel';
export function changeModelActions() {
    return {
        type:changeModel,
    }
}