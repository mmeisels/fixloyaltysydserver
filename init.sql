CREATE TABLE IF NOT EXISTS tokens (
    userId           BIGSERIAL,
    externalUserId   TEXT,
    token            TEXT NOT NULL UNIQUE,
    created          TIMESTAMP DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS wallet (
    userId       BIGINT,
    offerId      BIGINT
  );


CREATE SCHEMA IF NOT EXISTS salesforce;

CREATE TABLE IF NOT EXISTS salesforce.contact (
    id              BIGSERIAL,
    firstName       TEXT,
    lastName        TEXT,
    email           TEXT,
    mobilePhone     TEXT,
    leadsource      TEXT,
    accountid       TEXT,
    pictureURL__c   TEXT,
    preference__c   TEXT,
    size__c         TEXT,
    loyaltyid__c    TEXT,
    password__c     TEXT,
    fbUserId__c     TEXT,
    gender__c       TEXT,
    createddate     timestamp
  );

CREATE TABLE IF NOT EXISTS salesforce.interaction__c (
    id                      BIGSERIAL,
    contact__loyaltyid__c   TEXT,
    campaign__c             TEXT,
    product__c              TEXT,
    type__c                 TEXT,
    name__c                 TEXT,
    picture__c              TEXT,
    points__c               double precision,
    createddate             timestamp
  );

CREATE TABLE IF NOT EXISTS salesforce.campaign (
    id              BIGSERIAL PRIMARY KEY,
    sfId            TEXT,
    name            TEXT,
    startdate       DATE,
    enddate         DATE,
    description     TEXT,
    image__c        TEXT,
    campaignpage__c TEXT,
    publishdate__c  DATE,
    type            TEXT,
    status          TEXT
  );

CREATE TABLE IF NOT EXISTS salesforce.product2 (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT,
    description     TEXT,
    image__c        TEXT,
    productpage__c  TEXT,
    family  TEXT,
    publishdate__c  DATE
  );

CREATE TABLE IF NOT EXISTS salesforce.store__c (
    id                      BIGSERIAL PRIMARY KEY,
    name                    TEXT,
    location__latitude__s   TEXT,
    location__longitude__s  TEXT
  );

CREATE TABLE IF NOT EXISTS tokens (
    userId           BIGSERIAL,
    externalUserId   TEXT,
    token            TEXT NOT NULL UNIQUE,
    created          TIMESTAMP DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS wallet (
    userId       BIGINT,
    offerId      BIGINT
  );

CREATE TABLE IF NOT EXISTS wishlist (
    userId       BIGINT,
    productId    BIGINT
  );

CREATE TABLE IF NOT EXISTS picture (
    id           BIGSERIAL,
    userId       BIGINT,
    url          TEXT,
    publishDate  timestamp default current_timestamp
  );


