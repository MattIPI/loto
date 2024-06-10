export const getGrid = (id: string): LotoGrid => {
    return JSON.parse(localStorage.getItem('grid-' + id) ?? '[]') as LotoGrid;
};

export const saveGrid = (id: string, grid: LotoGrid) => {
    const value = JSON.stringify(grid);
    const gridKeys: string[] = JSON.parse(localStorage.getItem('grid-keys') ?? '[]');
    if (!gridKeys.includes(id)) {
        gridKeys.push(id);
        localStorage.setItem('grid-keys', JSON.stringify(gridKeys));
    }
    localStorage.setItem('grid-' + id, value);
};

export const getGrids = (): LotoGrid[] => {
    const gridKeys: string[] = JSON.parse(localStorage.getItem('grid-keys') ?? '[]');
    const grids: LotoGrid[] = [];

    gridKeys.forEach((key) => {
        grids.push(getGrid(key));
    });

    return grids;
};
