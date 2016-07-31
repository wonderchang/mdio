require! <[chai chromedriver]>
webdriver = require \selenium-webdriver
/* markteller-spec.ls */
/* eslint-env mocha */
expect = chai.expect
wd = webdriver

describe \markteller (_) !->

  done <-! it 'should be sent a url and get the document title in the page'
  driver = new webdriver.Builder!for-browser \phantomjs .build!
  driver.get \http://localhost:3000
  doc-url = driver.find-element wd.By.id \doc-url
  driver.wait wd.until.element-is-visible doc-url, 5000 .then !->
    doc-url.send-keys \https://hackmd.io/s/By_aEVUd
    doc-url.send-keys wd.Key.ENTER
    markvideo = driver.find-element wd.By.id \markvideo
    driver.wait wd.until.element-is-visible markvideo, 5000 .then !->
      marktitle = driver.find-element wd.By.id \marktitle
      actual <-! marktitle.get-text!then
      expected = 'The Three Little Pigs'
      expect actual .to.equal expected
  driver.quit!
  done!

