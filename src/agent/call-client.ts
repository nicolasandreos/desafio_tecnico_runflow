export async function callClient(
  action: string,
  request: () => Promise<unknown>,
): Promise<string> {
  try {
    const payload = await request();
    return JSON.stringify(payload);
  } catch (cause) {
    console.error(`${action} falhou: ${cause}`);
    return JSON.stringify({ error: "Não foi possível concluir a operação." });
  }
}
