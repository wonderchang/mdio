require! <[fs chai chai-as-promised assert]>
/* markdown-engine-spec.ls */
/* eslint-env mocha */
expect = chai.expect
chai.use chai-as-promised

describe \markdown-engine (_) !->

  Engine = require \../../lib/markdown-engine

  url =
    hackmd: \https://hackmd.io/s/By_aEVUd
    hackpad: \https://hackpad.com/Hackpad-API-v1.0-k9bpcEeOo2Q
    others: \https://www.google.com.tw

  it 'should exist' !->
    expect Engine .to.be.defined

  hackmd  = new Engine url.hackmd
  hackpad = new Engine url.hackpad
  others  = new Engine url.others

  test-story = fs.read-file-sync 'test/markdown-engine/test-story.md', \utf8

  describe "HackMD, test #{url.hackmd}" (_) !->

    describe "Check provider" (_) !->
      <-! it 'should be identified as HackMD'
      expect hackmd.provider .to.equal \hackmd

    describe "Check token" (_) !->
      <-! it 'should be identified as By_aEVUd'
      expect hackmd.token .to.equal \By_aEVUd

    describe "Check story content" (_) !->
      done <-! it 'should get the story from hackmd'
      actual <-! hackmd.request-story
      expect actual .to.equal test-story
      done!

  describe "Parse #{url.hackpad}" (_) !->
    <-! it 'should identity Hackpad provider'
    expect hackpad.provider .to.equal \hackpad

  describe "Parse #{url.others}" (_) !->
    <-! it 'should identity undefined provider'
    expect hackpad.others .to.equal undefined
