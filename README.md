# kubevirt-openshift-plugin

KubeVirt dynamic plugin for OpenShift console

## Running a development environment

Fire up a development environment with hot reloading.

### Steps

1. login to your cluster with `oc login`
2. run `yarn install-console` to create a static production build of console
3. run `yarn dev` to start the development server and wait for it to finish
4. Run `yarn run-bridge` to start the bridge
