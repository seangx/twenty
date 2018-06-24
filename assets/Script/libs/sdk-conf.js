let config = module.exports;

config.env = 'Test' ;// 必填 运行环境：开发Dev  测试Test  上线Prod，上线审核开始要把环境改为Prod
config.gameId = 'xxfc'; // 必填 游戏ID，去平台后台创建
config.offerId="";
config.gameVersion = '1.0.1'; // 可选 当前游戏版本号 当要根据游戏版本使用IP检测时必填
config.shareData = { // 可选 默认的分享数据
  title: '星星坟场',
  query: 'k1=v1',
  from: '',
  path: '',
  imageUrl: ''
};
config.getUserInfoBtn = { // 可选 默认的获取用户信息按钮的样式
  type: 'text',
  text: '获取用户信息',
  style: {
    left: 0,
    top: 0,
    width: 200,
    height: 200,
    lineHeight: 200,
    backgroundColor: '#00a2ff',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 4
  }
}

config.gameClubBtn = { // 可选 默认游戏圈按钮样式
  icon: 'green',
  style: {
    left: 10,
    top: 76,
    width: 40,
    height: 40
  }
};
