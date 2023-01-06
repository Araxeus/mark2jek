import path from 'path';
import fs from 'fs';

import { __dirname, lines, code, log } from './utils.js';

export default {
    configPath: getConfigPath(),
    filePath: '',
    savePath: '',

    load() {
        try {
            this.flags = {
                ...this.default,
                ...JSON.parse(fs.readFileSync(this.configPath))
            };
        } catch (e) {
            if (e.errno !== -4058) { //ENOENT https://nodejs.org/api/errors.html#common-system-errors
                log.warn(
                    'There has been an error parsing config.json, resetting to default config'
                );
            }
            this.flags = {
                ...this.default
            };
        }
    },

    async save() {
        try {
            fs.mkdirSync(path.dirname(this.configPath), { recursive: true });
            fs.writeFileSync(
                this.configPath,
                JSON.stringify(this.flags, null, '\t')
            );
            log.success('Saved Configuration');
        } catch (err) {
            log.warn('Could not save configuration data. details:');
            log.out(err.message);
        }
    },

    default: {
        outputName: {
            alias: 'new=',
            value: '',
            description: lines(
                'Special flag that specify the output filename (relative from input file directory)',
                `Used only as ${code('new=filename')} or ${code(
                    '--new=filename'
                )}. can leave empty to disable (not in setup)`
            )
        },
        pics: {
            alias: 'images',
            value: true,
            description: `Converts ${code('![](x)')} to ${code('<img src=x>')}`
        },
        nested: {
            alias: 'nestedUrl',
            value: true,
            description: `Converts ${code('[![](x)](y)')} to ${code(
                '<a href=y><img src=x></a>'
            )}`
        },
        raw: {
            alias: 'githubRaw',
            value: true,
            description: 'Convert github images to raw version (if needed)'
        },
        expand: {
            alias: 'collapsible',
            value: true,
            description: `Adds an icon to start collapsible content description (after ${code(
                '<summary>'
            )})`
        },
        codeblock: {
            alias: 'liquid',
            value: true,
            description: lines(
                'Replace:',
                code(lines('```languageName', 'codeblock lines', '```')),
                'With:',
                code(
                    lines(
                        '{% highlight languageName %}',
                        'codeblock lines',
                        '{% endhighlight %}'
                    )
                )
            )
        }
    }
};

function getConfigPath() {
    const name = 'mark2jek';

    let res;
    if (process.platform === 'darwin') {
        res = path.join(path.join(homedir, 'Library'), 'Preferences', name);
    } else if (process.platform === 'win32') {
        res = path.join(
            process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming'),
            name
        );
    } else {
        // linux
        res = path.join(
            process.env.XDG_CONFIG_HOME || path.join(homedir, '.config'),
            name
        );
    }

    if (dirnameNthParent(1) === 'node_modules')
        res = path.join(res, dirnameNthParent(2));

    return path.join(res, 'config.json');

    function dirnameNthParent(n) {
        let q = '';
        for (let i = 0; i < n; i++) q += '/..';
        return path.basename(path.resolve(__dirname, q));
    }
}
