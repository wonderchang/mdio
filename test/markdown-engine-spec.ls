require! <[fs chai assert]>
/* markdown-engine-spec.ls */
/* eslint-env mocha */
expect = chai.expect

describe \markdown-engine (_) !->

  Engine = require __dirname + \/../lib/markdown-engine

  url =
    hackmd: \https://hackmd.io/s/Bkbe8Ho_
    hackpad: \https://hackpad.com/Hackpad-API-v1.0-k9bpcEeOo2Q
    others: \https://www.google.com.tw

  it 'should exist' !->
    expect Engine .to.be.defined

  hackmd  = new Engine url.hackmd
  hackpad = new Engine url.hackpad
  others  = new Engine url.others

  test-fn = __dirname + \/mockdata.md
  test-data = (fs.read-file-sync test-fn, \utf8).trim!

  describe "HackMD, test #{url.hackmd}" (_) !->

    describe "Check provider" (_) !->
      <-! it 'should be identified as HackMD'
      expect hackmd.provider .to.equal \hackmd

    describe "Check token" (_) !->
      <-! it 'should be identified as Bkbe8Ho_'
      expect hackmd.token .to.equal \Bkbe8Ho_

    describe "Check markdown content" (_) !->
      @timeout 50000
      done <-! it 'should get the markdown from hackmd'
      actual <-! hackmd.request-markdown
      expect actual .to.equal test-data
      done!

  describe "Parse #{url.hackpad}" (_) !->
    <-! it 'should identity Hackpad provider'
    expect hackpad.provider .to.equal \hackpad

  describe "Parse #{url.others}" (_) !->
    <-! it 'should identity undefined provider'
    expect hackpad.others .to.equal undefined
