#!perl

use Tie::FileSystem;
use Data::Visitor::Callback;
use JSON::XS;

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
my $encoder = JSON::XS->new;
print $encoder->pretty->encode( $chomped );
