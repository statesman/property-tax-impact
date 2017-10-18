

## convert to json

- [csvjson](http://www.csvjson.com/csv2json)


# single-page-embed

Trying to set a template to start with when creating a single page to embed in Methode.

#### Install
```
$ npm install
$ grunt
```

#### Deploy to s3
* store AWS credentials as the environmental variables `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY_ID`
* make sure the "sitePath" property in `project.config.json` is correct
* `$ grunt stage` or `$ grunt prod`

## embed for Methode
Insert a code block and add this, which is the table and the pym code:

```
<div id="embed"></div>
<script src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>
var embed = new pym.Parent('embed', 'https://s3-us-west-2.amazonaws.com/apps.statesman.com/news/single-page-embed/index.html', {});
</script>
```

#### Metrics

> need to update this:

This project sends a custom Google event action `searched` to the Interactive Projects account under the category `20170815-school-ratings` when a user types in the search boxes.

The event fires at most once per session.
