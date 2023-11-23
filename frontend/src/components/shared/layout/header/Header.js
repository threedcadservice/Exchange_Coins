import { useReactiveVar } from '@apollo/client'
import React,{useState, useContext, useEffect } from 'react';
import {NavLink, Link, useHistory } from 'react-router-dom';
import { AppContext } from "../../../../contexts";
import * as RiIcons from 'react-icons/ri';
import * as IoIcons from 'react-icons/io';
import { makeStyles } from '@material-ui/core/styles';
import styled, {useTheme} from 'styled-components'
import { WalletButton } from '../../../multi-wallet/WalletButton'
import { accountVar, chainIdVar, wrongNetworkModalVar, languageVar } from '../../../../variables/WalletVariable'
import { isAllowedChain } from '../../../../services/UtilService'
import WrongNetworkModal from '../../WrongNetworkModal'
import Cookies from 'universal-cookie';
import { texts } from '../../../../styles/text'

const useStyles = makeStyles(theme => ({
    logo: {
        background: 'url(/logo/logo.png)',
        height: '80px',
        width: '100px',
        backgroundSize: '100% 100%',
        margin: '5px 0 0 15px',
        '@media(max-width:420px)' : {
            width: '200px',
            height: '60px',
            margin: '20px 0px'
        }
    },
    darkicon: {
        margin: '5px',
        marginTop: '22px',
        fontSize: '50px',
        padding: '12px',
        border: '1px solid rgb(133, 133, 133)',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '100px',
        color: 'black',
        '@media(min-width: 400px)' : {
            margin: '10px',
            marginTop: '22px',
            width: '85px'
          },
        '@media(min-width: 420px)' : {
            width: '55px'
        },
        '@media(min-width: 900px)' : {
            margin: '22px 30px 10px 30px',
            width: '50px'
        }
    },
    sunnyicon: {
        margin: '5px',
        marginTop: '22px',
        fontSize: '50px',
        padding: '12px',
        border: '1px solid rgb(133, 133, 133)',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '100px',
        color: 'white',
        '@media(min-width: 400px)' : {
            margin: '10px',
            marginTop: '22px',
            width: '85px'
          },
        '@media(min-width: 420px)' : {
            width: '55px'
        },
        '@media(min-width: 900px)' : {
            margin: '22px 30px 10px 30px',
            width: '50px'
        }
    },
    menuicon: {
        color: 'rgb(133, 133, 133)',
        border: '1px solid rgb(133, 133, 133)',
        fontSize: '45px',
        width: '120px',
        padding: '5px',
        margin: '5px',
        marginTop: '25px',
        borderRadius: '5px',
        '@media(min-width: 400px)' : {
            margin: '10px',
            marginTop: '25px',
            width: '100px'
          },
        '@media(min-width: 420px)' : {
            width: '50px'
          },
        '@media(min-width: 1280px)' : {
            display: 'none'
          }
    }
}));
const Navbarmenu = () => {
    const [isMenu, setisMenu] = useState(false);
    const history = useHistory();
    const [isResponsiveclose, setResponsiveclose] = useState(false);
    const {user, setUser, theme, setTheme} = useContext(AppContext);
    const themes = useTheme();
    const styles = useStyles();
    const toggleClass = () => {
        setisMenu(isMenu === false ? true : false);
        setResponsiveclose(isResponsiveclose === false ? true : false);
    };

    let boxClass = ["main-menu menu-right menuq1"];
    if(isMenu) {
        boxClass.push('menuq2');
    }else{
        boxClass.push('');
    }

    const [isSubMenuCreate, setSubMenuCreate] = useState(false);
    
    let createSubMenuClass = ["sub__menus"];
    if(isSubMenuCreate) {
        createSubMenuClass.push('sub__menus__Active');
    }else {
        createSubMenuClass.push('');
    }

    const [isSubMenuLogin, setSubMenuLogin] = useState(false);

    const loginSubmenu = () => {
        setSubMenuCreate(false);
        setSubMenuLogin(isSubMenuLogin === false ? true : false);
    };

    let loginSubmenuClass = ["sub__menus"];
    if(isSubMenuLogin) {
        loginSubmenuClass.push('sub__menus__Active');
    } else {
        loginSubmenuClass.push('');
    }

    const logout = () => {
        const cookies = new Cookies();
        cookies.remove("token", {path: "/"}) 
        setUser({    
            authenticated: false,
            user_id: "",
            username: "", 
            email: "",
            exp: 0,
            first_name: "",
            last_name: "",
            phone: "",
            private_key: "",
            public_key: "",
            profile_cover: "",
            profile_image: "",
            paypal: "",
            role: 2,
            status: ""});
        history.push('/');
    }

    const changeTheme = (e, val) => {
        e.preventDefault()
        localStorage.setItem('theme', val);
        setTheme({theme: val})
    }

    const changeLanguage = (e, val) => {
        e.preventDefault()
        localStorage.setItem('language', val);
        languageVar(val)
    }

    const account = useReactiveVar(accountVar)
    const chainId = useReactiveVar(chainIdVar)
    const language = useReactiveVar(languageVar)

    const rightChain = !!account && isAllowedChain(chainId)

    useEffect(() => {
        !account || rightChain ? wrongNetworkModalVar(false) : wrongNetworkModalVar(true)
    }, [account, rightChain])

    return (
    <S.Header className="header__middle" >
        {/* Add Logo  */}
        <NavLink exact activeClassName='is-active' className={styles.logo} to="/" />
        <div className="header__middle__menus">
            <nav className="main-nav " >
                <S.SubMenu className={boxClass.join(' ')}>
                    <li className="menu-item " ><NavLink onClick={()=>toggleClass()} exact activeClassName='is-active' to={`/`} style={{color: themes.gray['4']}}> {texts[language]['homemenu']} </NavLink> </li>
                    <li className="menu-item " ><NavLink onClick={()=>toggleClass()} activeClassName='is-active' to={`/exchange`} style={{color: themes.gray['4']}}> {texts[language]['exchangemenu']} </NavLink> </li>
                    <li className="menu-item " ><NavLink onClick={()=>toggleClass()} exact activeClassName='is-active' to={`/price`} style={{color: themes.gray['4']}}> {texts[language]['chartmenu']} </NavLink> </li>
                    <li className="menu-item " ><NavLink onClick={()=>toggleClass()} activeClassName='is-active' to={`/support`} style={{color: themes.gray['4']}}> {texts[language]['supportmenu']} </NavLink> </li>
                    {user.authenticated?
                        <li onClick={loginSubmenu} className="menu-item sub__menus__arrows" > 
                            <Link to="#" style={{color: themes.gray['4']}}>                                                       
                                {user.username} 
                            </Link>
                            <ul className={loginSubmenuClass.join(' ')} style={{background: themes.light}} > 
                                <li className='sub-item'><NavLink onClick={logout} activeClassName='is-active' to={`/`} style={{color: themes.gray['4']}}> {texts[language]['logoutmenu']} </NavLink> </li>
                            </ul>
                        </li>
                    :
                        <li className="menu-item " ><NavLink onClick={()=>toggleClass()} activeClassName='is-active' to={`/login`} style={{color: themes.gray['4']}}> {texts[language]['loginmenu']} </NavLink> </li> 
                    }  
                    <li onClick={loginSubmenu} className="menu-item sub__menus__arrows" > 
                        <Link to="#" style={{color: themes.gray['4']}}>                                                       
                        {texts[language]['languagemenu']}
                        </Link>
                        <ul className={loginSubmenuClass.join(' ')} style={{background: themes.light}} > 
                            <li className='sub-item'><NavLink onClick={(e)=>changeLanguage(e, 'english')} to={`#`} style={{color: themes.gray['4']}}> {texts[language]['englishmenu']} </NavLink> </li>
                            <li className='sub-item'><NavLink onClick={(e)=>changeLanguage(e, 'chinese')} to={`#`} style={{color: themes.gray['4']}}> {texts[language]['chinesemenu']} </NavLink> </li>
                        </ul>
                    </li>     
                </S.SubMenu>
            </nav>     
        </div> 
        <WalletButton />
        {theme.theme==='dark'?
            <IoIcons.IoIosSunny onClick={(e)=>changeTheme(e, 'light')} className={styles.sunnyicon}/>
        :
            <RiIcons.RiMoonLine onClick={(e)=>changeTheme(e, 'dark')} className={styles.darkicon}/>
        }        
        <RiIcons.RiMenuLine onClick={toggleClass} className={styles.menuicon} />
        <WrongNetworkModal />
    </S.Header>
    )
}

export default Navbarmenu

export const S = {
    Header: styled.div `
        background: ${props=>props.theme.light};
    `,
    SubMenu: styled.ul `
        background: ${props=>props.theme.light} !important;
    `
}