/**
 * Created by Ebates on 16/12/22.
 */
import InitialState from '../InitialState/QuickLogInitialState'
import *as quickLogAction from '../Actions/QuickLogAction'

const initialState = new InitialState();

export default function quickLogReducer (state = initialState, action){
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type){
        case  quickLogAction.oauthCodeBtState.enable:
        {
            let nextState = state
            // .setIn(['oauthCodeBtState'], quickLogAction.oauthCodeBtState.enable) 直接赋值对象不行,因 其他action里 需要 找到
            // oauthCodeBtState的 title 等熟悉,而此处赋值后,keypath 最低端就只能到 oauthCodeBtState
                .setIn(['oauthCodeBtState','id'], quickLogAction.oauthCodeBtState.enable.id)
                .setIn(['oauthCodeBtState','backColor'], quickLogAction.oauthCodeBtState.enable.backColor)
                .setIn(['oauthCodeBtState','disabled'], quickLogAction.oauthCodeBtState.enable.disabled)
                .setIn(['oauthCodeBtState','title'], quickLogAction.oauthCodeBtState.enable.title)
            return nextState
        }
        break;

        case  quickLogAction.oauthCodeBtState.unable:
        {
            let nextState = state
                .setIn(['oauthCodeBtState','id'], quickLogAction.oauthCodeBtState.unable.id)
                .setIn(['oauthCodeBtState','backColor'], quickLogAction.oauthCodeBtState.unable.backColor)
                .setIn(['oauthCodeBtState','disabled'], quickLogAction.oauthCodeBtState.unable.disabled)
                .setIn(['oauthCodeBtState','title'], quickLogAction.oauthCodeBtState.unable.title)

            return nextState
        }
            break;
        case  quickLogAction.oauthCodeBtState.countDown:
        {
            let nextState = state
                .setIn(['oauthCodeBtState','id'], quickLogAction.oauthCodeBtState.countDown.id)
                .setIn(['oauthCodeBtState','backColor'], quickLogAction.oauthCodeBtState.countDown.backColor)
                .setIn(['oauthCodeBtState','disabled'], quickLogAction.oauthCodeBtState.countDown.disabled)
                .setIn(['oauthCodeBtState','title'], quickLogAction.oauthCodeBtState.countDown.title+'('+action.lastTime+'s)');
            return nextState
        }
            break;
        case  quickLogAction.oauthCodeBtState.resend:
        {
            let nextState = state
                .setIn(['oauthCodeBtState','id'], quickLogAction.oauthCodeBtState.resend.id)
                .setIn(['oauthCodeBtState','backColor'], quickLogAction.oauthCodeBtState.resend.backColor)
                .setIn(['oauthCodeBtState','disabled'], quickLogAction.oauthCodeBtState.resend.disabled)
                .setIn(['oauthCodeBtState','title'], quickLogAction.oauthCodeBtState.resend.title)
            return nextState
        }
            break;
    }
        /**
     * ## Default
     */
    return state
}