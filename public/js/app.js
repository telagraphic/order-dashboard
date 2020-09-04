const staggerDuration = .02;

barba.use({preFetch: true});

barba.init({
  transitions: [
    {
      name: 'fade',
      once({current, next, trigger}) {
        let serviceName = document.querySelector('.header__service-name');
        let serviceUpdate = document.querySelector('.header__update-time');

        serviceName.textContent = document.querySelector('.barba-container').getAttribute('data-service-name');
        serviceUpdate.textContent = document.querySelector('.barba-container').getAttribute('data-service-update');

        return new Promise(resolve => {

          const timeline = gsap.timeline({
            onComplete() {
              resolve();
            }
          })

          timeline
            .set('.header', {opacity: 0, y: -100})
            .set('main', {opacity: 0})
            .to('.orders__body-row', {opacity: 0})
            .to('.header', {opacity: 1, y: 0, duration: .25, ease: 'power4.out'}, 1)
            .to('.orders__body-row', {stagger: staggerDuration, opacity: 1})
            .to('main', {opacity: 1, duration: .25}, 1);

        });
      },
      beforeEnter({current, next, trigger}) {
        let links = document.querySelectorAll('.header__navigation-link');

        links.forEach(link => {

          if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('header__navigation-link--active');
          } else {
            link.classList.remove('header__navigation-link--active');
          }

        });

        let serviceName = document.querySelector('.header__service-name');
        let serviceUpdate = document.querySelector('.header__update-time');

        serviceName.textContent = next.container.getAttribute('data-service-name');
        serviceUpdate.textContent = next.container.getAttribute('data-service-update');

        let newTableHeader = next.container.querySelector('.orders__header');
        const tableHeader = document.querySelector('.orders__header');
        tableHeader.innerHTML = newTableHeader.innerHTML;

      },
      enter({current, next, trigger}) {

        return new Promise(resolve => {

          const timeline = gsap.timeline({
            onComplete() {
              resolve();
            }
          });

          timeline
            .from(next.container, {opacity: 1}, 0)
            .from('.orders__header-col', {opacity: 0}, 0)
            .from('.orders__body-row', {opacity: 0}, 0)
            .to('.orders__body-row', {stagger: staggerDuration, opacity: 1}, 0)
            .to('.header__service-name', {opacity: 1, ease: 'power4.out', duration: .25})
            .to('.header__update-time', {opacity: 1, ease: 'power4.out', duration: .25});
        })

      },
      afterEnter({current, next, trigger}) {
        return new Promise(resolve => {

          const timeline = gsap.timeline({
            onComplete() {
              resolve();
            }
          })

          timeline
            .to('.orders__header-col', {opacity: 1, duration: .25}, 0)
        })
      },
      leave({current, next, trigger}) {
        return new Promise(resolve => {

          const timeline = gsap.timeline({
            onComplete() {
              resolve();
              current.container.remove();
            }
          })

          timeline
            .to('.orders__header-col', {opacity: 0, duration: 1}, 0)
            .to('.orders__body-row', {stagger: staggerDuration, opacity: 0}, 0);
        })
      }
    }
  ],
  debug: true
});

new Tablesort(document.getElementById('orders'), {
  descending: true
});
