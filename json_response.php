<?php
# Include DirectorAPI class file
# and create a new instance of the class
# Be sure to have entered your API key and path in the DirectorPHP.php file.
include('classes/DirectorPHP.php');
$director = new Director('local-ef8899f7e4cc749b26a8517e8a1ceb83', 'edsalter.com/SSP_Director_1.3.5/ssp_director');

# When your application is live, it is a good idea to enable caching.
# You need to provide a string specific to this page and a time limit 
# for the cache. Note that in most cases, Director will be able to ping
# back to clear the cache for you after a change is made, so don't be 
# afraid to set the time limit to a high number.
# 
# $director->cache->set('myrandomstring', '+30 minutes');

# What sizes do we want?

# We can also request the album preview at a certain size
$director->format->preview(array('width' => '100', 'height' => '50', 'crop' => 1, 'quality' => 85, 'sharpening' => 1));

# Make API call using get_album method. Replace "1" with the numerical ID for your album
//$album = $director->album->get(1);

//$gallery = $director->gallery->all(); 

# Set images variable for easy access
//$contents = $album->contents[0];

	//thumbnails
$format = array(
	'name' => 'thumb',
	'width' => '100', 
	'height' => '100',
	'crop' => 1,
	'quality' => 75,
	'sharpening' => 1
);
 
//large images
$big = array(
	'name' => 'big',
	'width' => '1000',
	'height' => '1000',
	'crop' => 0,
	'quality' => 95,
	'sharpening' => 1
);

$director->format->add($format);
$director->format->add($big);
 
$recent = $director->content->all(array('limit' => 10, 'only_images' => true));
 /*
foreach($recent as $content) {
echo '<a href="' . $content->big->url . '">';
echo '<img src="' . $content->thumb->url . '" width="' . $content-> thumb->width . '" height="' . $content-> thumb->height . '"  />';
echo '</a>';
}*/

echo json_encode($recent);
?>