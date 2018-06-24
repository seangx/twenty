var exports = module.exports = {};

var utils = {
  safeCall: function (callback) {
    if (callback != null && (typeof callback == 'function')) {
      console.log('safe call');
      callback();
    }
  },
 
  getWeekStartPostfix: function() {
    var now = new Date();
    var weekStart = null;
    if (now.getDay() === 0) {
      weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    }
    else {
      weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() - 1));
    }

    return weekStart.getFullYear() + "-" + (weekStart.getMonth() + 1) + "-" + weekStart.getDate();
 },

  getScoreKey: function() {
    return "score-" + utils.getWeekStartPostfix();
  }
}

exports.init = function(success, fail) {
  wx.postMessage({
    message: "init"
  });
  if (wx.showShareMenu == null) {
    console.log('wx showShareMenu api not exist');
    utils.safeCall(fail);
    return;
  }

  wx.showShareMenu({
    withShareTicket: true,
    success: function (res) {
      console.log(`wx show share menu called success, res=${JSON.stringify(res)}`);
      utils.safeCall(success);
    },
    fail: function (err) {
      console.log(`wx show share menu called failed, err=${JSON.stringify(err)}`);
      utils.safeCall(fail);
    },
    complete: function (res) {
      console.info(`wx show share menu called complete`);
    }
  });

}

exports.displayFriendRank = function(selfOpenid) {
  if (wx.postMessage == null) {
    console.log('wx postMessage api not exist');
    return;

  }

  console.log('wx postMessage self open id=', selfOpenid);
  wx.postMessage({
    message: "friendRank",
    value: { self: selfOpenid }
  })
}

exports.displayGroupRank = function(selfOpenid) {
  if (wx.postMessage == null) {
    console.log('wx postMessage api not exist');
    return;
  }

  if (wx.shareAppMessage == null) {
    console.log('wx shareAppMessage api not exist');
    return;
  }

  wx.shareAppMessage({
    title: "查看群排行",
    success: (res) => {
      console.log("share success, res=", JSON.stringify(res));
      if (res.shareTickets != null) {
        wx.postMessage({
          message: "groupRank",
          value: { self: selfOpenid, "ticket": res.shareTickets[0] }
        })
      }
    }
  })
}

exports.displayPassRank = function(selfOpenid, score) {
  if (wx.postMessage == null) {
    console.log('wx postMessage api not exist');
    return;
  }

  wx.postMessage({
    message: "passRank",
    value: { self: selfOpenid, score: score}
  })
}

exports.hide = function() {
  if (wx.postMessage == null) {
    console.log('wx postMessage api not exist');
    return;
  }

  wx.postMessage({
    message: "hide"
  });
}

exports.submitScore = function(score, success, fail) {
  if (wx.setUserCloudStorage == null) {
    console.log('wx setUserCloudStorage api not exist');
    utils.safeCall(fail);
    return;
  }

  wx.postMessage({
      message: "submitScore",
      value: score
  });

  utils.safeCall(success);
}