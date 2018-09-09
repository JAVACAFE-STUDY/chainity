export default {
  items: [
    // {
    //   name: 'Dashboard',
    //   url: '/dashboard',
    //   icon: 'icon-speedometer'
    // },
    {
      name: '이슈',
      url: '/issues',
      icon: 'icon-list'
    },
    {
      name: '사용자',
      url: '/users',
      icon: 'icon-people'
    },
    {
      name: '거래내역',
      url: '/receipt',
      icon: 'icon-speedometer'
    },
    {
      name: '관리자메뉴',
      url: '/admin',
      icon: 'icon-puzzle',
      children: [
        {
          name: '토큰충전요청',
          url: '/admin/tokens-requests',
          icon: 'icon-puzzle'
        }
      ]
    },
    {
      name: '시스템메뉴',
      url: '/admin',
      icon: 'icon-puzzle',
      children: [
        {
          name: '가입요청관리',
          url: '/system/register-requests',
          icon: 'icon-people'
        },
        {
          name: '회원역활관리',
          url: '/system/users-role',
          icon: 'icon-people'
        }
      ]
    }
  ]
}
