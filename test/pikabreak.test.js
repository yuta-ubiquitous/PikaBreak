var assert = require('assert');
const pikabreak = require('../pikabreak')

describe('PikaBreak', function () {
  describe('#indexOf()', function () {
    
    let counter = 0

    let p = new Promise((resolve, reject)=>{
      const lo = () =>{
        pikabreak.detectBeacon('p')
        counter += 1
        if(counter < 20){
          setTimeout(lo, 1000)
        }else{
          resolve()
        }
      }
      lo()
    })
    p.then(v=>{
      setTimeout(()=>{
        return
      }, 10000)
    })
  });
});