angular.module('nibs_ibeacon.config', [])


    .constant('SERVER_URL', 'https://fixloyaltysyd.herokuapp.com')

    .constant('FB_APP_ID','280928808916046')
    .constant('STATUS_LABELS', [
        'Barley',
        'Black malt',
        'Hefe'
    ])

    .constant('STATUS_DESCRIPTIONS', [
        'Barley - A cereal grain that is malted for use in the grist that becomes the mash in the brewing of beer.',
        'Black malt - Partially malted barley roasted at high temperatures. Black malt gives a dark color and roasted flavor to beer.',
        'Hefe - A German word meaning "yeast". Used mostly in conjunction with wheat (weiss) beers to denote that the beer is bottled or kegged with the yeast in suspension (hefe-weiss). These beers are cloudy, frothy and, very refreshing. Hogshead'
    ]);