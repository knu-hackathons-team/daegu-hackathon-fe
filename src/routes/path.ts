export const RouterPath = {
    root: '/',
    main: '/',
    login: '/login',
    signup: '/signup',
    mypage: '/mypage',
  };
  
  export const getDynamicPath = {
    login: (redirect?: string) => {
      const currentRedirect = redirect ?? window.location.href;
      return `${RouterPath.login}?redirect=${encodeURIComponent(currentRedirect)}`;
    },
  };