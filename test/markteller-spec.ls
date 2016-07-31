require! <[chai chromedriver]>
webdriver = require \selenium-webdriver
/* markteller-spec.ls */
/* eslint-env mocha */
expect = chai.expect
wd = webdriver

describe \markteller (_) !->
  <-! it 'should be get text'
  driver = new webdriver.Builder!for-browser \phantomjs .build!
  driver.get \http://localhost:3000
  doc-url = driver.find-element wd.By.id \doc-url
  doc-url.send-keys \https://hackmd.io/s/By_aEVUd
  doc-url.send-keys wd.Key.ENTER
  markvideo = driver.find-element wd.By.id \markvideo
  driver.quit!
