#!perl

use Tie::FileSystem;
use Data::Dumper;
use Data::Visitor::Callback;

my %data;
tie %data, "Tie::FileSystem", ( 'dir' => "_design" );
my $v = Data::Visitor::Callback->new(
    value => sub {
        my ($v, $d) = @_;
        chomp $d;
        return $d;
    },
);
my $chomped = $v->visit(\%data);
print Dumper($chomped);
