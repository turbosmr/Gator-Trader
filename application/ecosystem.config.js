module.exports = {
  apps: [{
    name: 'csc648-team03-sfsu-buy-sell',
    script: './application/index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-18-223-247-243.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/admin.pem',
      ref: 'origin/master',
      repo: 'git@github.com:CSC-648-SFSU/csc648-fall2019-Team03.git',
      path: '/home/ubuntu/csc648-fall2019-Team03',
      'post-deploy': 'npm install && pm2 startOrRestart ./application/ecosystem.config.js'
    }
  }
}
