const ranks = {
    'bronze-1': 'Bronze I',
    'bronze-2': 'Bronze II',
    'bronze-3': 'Bronze III',
    'bronze-4': 'Bronze IV',
    'silver-1': 'Silver I',
    'silver-2': 'Silver II',
    'silver-3': 'Silver III',
    'silver-4': 'Silver IV',
    'gold-1': 'Gold I',
    'gold-2': 'Gold II',
    'gold-3': 'Gold III',
    'gold-4': 'Gold IV',
    'platinum-1': 'Platinum I',
    'platinum-2': 'Platinum II',
    'platinum-3': 'Platinum III',
    'platinum-4': 'Platinum IV',
    'diamond-1': 'Diamond I',
    'diamond-2': 'Diamond II',
    'diamond-3': 'Diamond III',
    'diamond-4': 'Diamond IV',
    'master': 'Master',
    'grand-master': 'Grand-Master',
    'legend': 'Legend'
}

export default (id) => {
    return ranks[id]
}