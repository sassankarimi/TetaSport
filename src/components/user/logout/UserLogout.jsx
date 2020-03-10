/****************** User Logout **********************/

export default function Logout(props) {
    localStorage.removeItem('exID');
    localStorage.removeItem('Intrest');
    localStorage.removeItem('CoverPhoto');
    localStorage.removeItem('Day');
    localStorage.removeItem('Family');
    localStorage.removeItem('Gn');
    localStorage.removeItem('Month');
    localStorage.removeItem('Name');
    localStorage.removeItem('OrderingID');
    localStorage.removeItem('Username');
    localStorage.removeItem('Year');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('league-gallery');
    localStorage.removeItem('view_profile');
    localStorage.removeItem('countOfFav');
    localStorage.removeItem('about');
    localStorage.removeItem('prv');
    localStorage.removeItem('city');
    localStorage.removeItem('Token');
    window.location.replace('/login');
}

export function LogoutSoft(props) {
    localStorage.removeItem('exID');
    localStorage.removeItem('Intrest');
    localStorage.removeItem('CoverPhoto');
    localStorage.removeItem('Day');
    localStorage.removeItem('Family');
    localStorage.removeItem('Gn');
    localStorage.removeItem('Month');
    localStorage.removeItem('Name');
    localStorage.removeItem('OrderingID');
    localStorage.removeItem('Username');
    localStorage.removeItem('Year');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('league-gallery');
    localStorage.removeItem('view_profile');
    localStorage.removeItem('countOfFav');
    localStorage.removeItem('about');
    localStorage.removeItem('prv');
    localStorage.removeItem('city');
    localStorage.removeItem('Token');
    window.location.replace('/login');
}

