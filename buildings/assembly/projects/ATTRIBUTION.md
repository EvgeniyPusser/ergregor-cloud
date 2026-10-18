# Sample architectural project

**Duplex Apartment** — architectural model `Duplex_A_20110907.ifc` (Autodesk Revit Architecture 2011, IFC 2x3).

Source: BSI (2020) "Duplex Apartment Test Files," buildingSMART International.
https://github.com/buildingsmart-community/Community-Sample-Test-Files/tree/main/IFC%202.3.0.1%20(IFC%202x3)/Duplex%20Apartment

License: Creative Commons Attribution 4.0 International (CC BY 4.0), https://creativecommons.org/licenses/by/4.0/

Changes made for this program:
- converted from IFC to glTF binary (`duplex.glb`) with IfcOpenShell 0.9 + trimesh;
- coordinates converted from Z-up to Y-up;
- furniture, spaces, opening volumes, site and proxy objects removed;
- geometry merged per IFC element type and coloured by type (walls, slabs, windows, doors, …);
- `duplex.glb.js` is the same file embedded as base64 so it opens from disk without a web server.
