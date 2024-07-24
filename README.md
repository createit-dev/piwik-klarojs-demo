## how to load klarojs via PIWIK

1. Piwik Pro / Tag Manager / Tags - Add a tag
2. Custom code (async):
```javascript
<script type="text/javascript" src="/assets/config.js"></script>
<script type="text/javascript" src="/assets/klaro.js"></script>
```
OR
```javascript
<script type="text/javascript" src="[your_external_domain]/assets/config.js"></script>
<script type="text/javascript" src="[your_external_domain]/assets/klaro.js"></script>
```

3. Add trigger - pageView
4. Consent type - No consent is required
5. Publish Tag Manager

## build angular app
Use Node 18.17.1
1. `npm install --foce`
2. `npm run start` for development
2. `npm run build` for build
