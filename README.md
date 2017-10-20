# property-tax-impact

A project that looks explains property tax assessments, exemptions and bills, and looks at some properties over time.

- The data is saved in a [google spreadsheet](https://docs.google.com/spreadsheets/d/1yo5CCop7_HmBy50GbfqfK7h2AMWPU2aiA_igrp-7qso/edit#gid=37844223)
- The first sheet is the data for the interactive. It is hand-converted with [csvjson](http://www.csvjson.com/csv2json) and saved in `src/data/data.json`.
- The tax bills some from county assessment sites.
    + [Bastrop](https://propaccess.trueautomation.com/clientdb/?cid=46)
    + [Hays](http://esearch.hayscad.com/)
    + [Travis](http://propaccess.traviscad.org/clientdb/?cid=1)
    + [Williamson](http://orionpa.tylerhost.net/)
- I spot checked travis assessments against [the tax office](https://tax-office.traviscountytx.gov/online-services/print-bills-and-receipts)
- Graphics are done in the google spreadsheet and then saved down into the project.

## embed for Methode
Insert a code block and add this, which is the table and the pym code:

### for production
```
<div id="embed"></div>
<script src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>
var embed = new pym.Parent('embed', 'https://s3-us-west-2.amazonaws.com/apps.statesman.com/news/property-tax-impact/index.html', {});
</script>
```

### for staging
```
<div id="embed"></div>
<script src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>
var embed = new pym.Parent('embed', 'https://s3-us-west-2.amazonaws.com/dev.apps.statesman.com/news/property-tax-impact/index.html', {});
</script>
```

#### Install
```
$ npm install
$ grunt
```

#### Deploy to s3
* store AWS credentials as the environmental variables `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY_ID`
* make sure the "sitePath" property in `project.config.json` is correct
* `$ grunt stage` or `$ grunt prod`

#### Metrics

> need to update this:

This project sends a custom Google event action `searched` to the Interactive Projects account under the category `20170815-school-ratings` when a user types in the search boxes.

The event fires at most once per session.
