// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('role') : str;
  // typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // return authority || ['admin'];
  return authority;
}

export function setAuthority(authority) {
  // const proAuthority = typeof authority === 'string' ? [authority] : authority;
  // return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  localStorage.setItem('crmtoken', authority);
  return localStorage.setItem('role', 'admin');
}

export function cleanAuthority() {
  localStorage.removeItem('crmtoken');
  localStorage.removeItem('role');
  localStorage.removeItem('auth');
}

export function gettoken() {
  return localStorage.getItem('crmtoken');
}

export function setauth(auth) {
  return localStorage.setItem('auth', JSON.stringify(auth));
}

export function getauth() {
  return JSON.parse(localStorage.getItem('auth')) || {};
}

export function setaddr(auth) {
  return localStorage.setItem('addr', JSON.stringify(auth));
}

export function getaddr() {
  return JSON.parse(localStorage.getItem('addr')) || [];
}

export function setqueryaddr(auth) {
  return localStorage.setItem('queryaddr', JSON.stringify(auth));
}

export function getqueryaddr() {
  return JSON.parse(localStorage.getItem('queryaddr')) || [];
}
