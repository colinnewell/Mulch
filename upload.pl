#!perl

use CouchDB::Client;
use Path::Tiny;

my $file = shift;
die 'Specify file to upload' unless $file;

my $c = CouchDB::Client->new(uri => 'http://couchdb:5984/');
$c->testConnection or die "The server cannot be reached";
print "Running version " . $c->serverInfo->{version} . "\n";
my $db = $c->newDB('mulch');
my $f = path($file);
my $stat = $f->stat;
$db->newDoc(undef, undef, {
    filename => $file,
    data => $f->slurp_utf8,
    upload_time => time,
    dev => $stat->dev,
    mode => $stat->mode,
    uid => $stat->uid,
    gid => $stat->gid,
    size => $stat->size,
    atime => $stat->atime,
    mtime => $stat->mtime,
    ctime => $stat->ctime,
    type => 'openerp_log',
})->create;
