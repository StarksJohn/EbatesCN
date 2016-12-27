/**
 * Created by Ebates on 16/12/27.
 * 注册相关的actions
 */
import Colors from '../../Utils/Colors'

export const registerBtStates={
    unable:{
        disabled:true,
        backColor:Colors.halfOpacityAppUnifiedBackColor
    },
    enable:{
        disabled:false,
        backColor:Colors.appUnifiedBackColor
    },
}

export const  changeRegisterBtStates='changeRegisterBtStates';
export function changeRegisterBtStatesActions(b) {
    return {
        type:changeRegisterBtStates,
        newState:b?registerBtStates.enable:registerBtStates.unable
    }
}