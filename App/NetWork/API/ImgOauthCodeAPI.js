/**
 * Created by Ebates on 16/12/30.
 *
 * 图片验证码接口
 */
import *as Math from '../../Utils/Math'

//本地测试 验证码图片用, 接口好了就删了
const IMAGES = [
    'http://www.savethecat.com/wp-content/uploads/2015/06/cats.jpg',
    'http://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
    'http://media4.popsugar-assets.com/files/2014/08/08/878/n/1922507/caef16ec354ca23b_thumb_temp_cover_file32304521407524949.xxxlarge/i/Funny-Cat-GIFs.jpg',
    'http://media1.santabanta.com/full1/Animals/Cats/cats-87a.jpg',
    'http://awesomegifs.com/wp-content/uploads/cat-smacks-at-hands.gif',
];

//获取验证码图片 接口
export function imgOauthCodeAPI() {
    return IMAGES[Math.randomNums(0, IMAGES.length - 1)];
}