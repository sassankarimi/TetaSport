import  React,{ Component } from 'react';
import { NavMenuLogin } from '../../NavMenu';

export default class UserLogin extends Component {
    static displayName = UserLogin.name;

    render() {
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت | ورود / ثبت نام `;
        return (
            <NavMenuLogin {...this.props} />
        );
    }
}
