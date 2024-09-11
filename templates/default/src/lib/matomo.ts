window._paq = {
  push: function (args: any) {
    window.remix.call('matomo', 'track', args)
  }
}